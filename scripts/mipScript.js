import dotenv from 'dotenv';
import fetch from 'node-fetch';
import knex from 'knex';

dotenv.config();

console.log("Running CU Mip Table Script...");

//Select REST API string from the environment variables
const mipRequest = process.env.MIP_REQUEST;


//Connect to database selected in the .env file
const db = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
});


const fetchDB = async (mipDict) => {
    if (mipDict.length != 0) {
        console.log(await db.insert(mipDict).into('CuMip'));
    }
};

//Retrieve Core Unit code for the relevant Core Unit
const readDbCu = async () => {
    var result = await db.select('code', 'id').from('CoreUnit');
    return result;
};

//Checks the current results of the Core Unit MIP table 
const readDbCuMip = async () => {
    var result = await db.select('*').from('CuMip');
    return result;
};

//Retreive the data from the MIP API
const getData = async () => {
    const result = await fetch(mipRequest);
    const data = await result.json();

    //Pass the returned results to the cuMipTable function
    await cuMipTable(data);

    //Close process
    process.exit(0);

};

//Check for existence in the CU MIP table
const checkUnique = (data, mip) => {

    var length = data.length;
    for (var i = 0; i < length; i++) {
        var mipCode = data[i].mipCode;
        mipCode.replace("-", "");
        if (mipCode == mip) {
            return true;
        }
    }
};

const cuMipTable = async (data) => {

    var cuMipEntry = [];

    var cuTable = await readDbCu();
    var cuMipTable = await readDbCuMip();

    var cuTableLength = cuTable.length;
    var resLength = data['total'];

    console.log("MIP API Response: ");

    for (var i = 0; i < resLength - 1; i++) {


        var fullMipCode = data['items'][i]['mipName'];
        var sp = fullMipCode.substring(9, 11);
        var mipTitle = data['items'][i]['title'];
        var dateRFC = data['items'][i]['dateProposed'];
        var ratified = data['items'][i]['dateRatified'];
        var status = data['items'][i]['status'];
        var forumUrl = data['items'][i]['forumLink'];
        var cuId = null;
        if (fullMipCode.includes('MIP39') || fullMipCode.includes('MIP40') || fullMipCode.includes('MIP41')) {


            var mipDict = {}
            var cuCode = cuCodeParse(data['items'][i]['tags']);
            for (var j = 0; j < cuTableLength - 1; j++) {
                if (cuCode == cuTable[j].code.toLowerCase()) {
                    cuId = cuTable[j].id;
                }
            }


            if (cuId != null) {


                mipDict.cuId = cuId;
                mipDict.mipCode = fullMipCode;
                mipDict.mipTitle = mipTitle;
                mipDict.rfc = dateRFC;
                mipDict.mipStatus = status;
                mipDict.forumUrl = forumUrl;
                mipDict.mipUrl = 'https://mips.makerdao.com/mips/details/' + fullMipCode;
                var parsedMonth = parseInt(ratified.substring(5, 7));
                if (parsedMonth > 12) {
                    ratified = null;
                } else if (isNaN(parsedMonth)) {
                    ratified = null;
                }
                if (status == 'Accepted') {
                    mipDict.accepted = ratified;
                    mipDict.rejected = null;
                }
                if (status == 'Rejected') {
                    mipDict.rejected = ratified;
                    mipDict.accepted = null;
                }
                if (checkUnique(cuMipTable, fullMipCode) != true) {
                    if (status === 'Obsolete' && fullMipCode.includes('MIP40') && sp > 88) {
                        cuMipEntry.push(mipDict);
                    }
                    if (mipDict.dateRFC == undefined && mipDict.accepted == undefined && mipDict.rejected == undefined) {} else {
                        cuMipEntry.push(mipDict);
                    }

                }
            }
        }
    }

    await fetchDB(cuMipEntry);

    console.log(cuMipEntry);
    if (cuMipEntry.length == 0) {
        console.log("CuMip table up-to-date for MIP entries");
    } else {
        console.log("Successfully added " + cuMipEntry.length + " entries to the CuMip table");
    }
};

//Parse the CU Code from the MIP API response
const cuCodeParse = (tags) => {
    if(tags){
    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const match = tag.match(/([a-z]{3,4}-001)$/);
        if (match) {
            console.log(match);
            return match[1];
        }
    }
}
    return null;
};


getData();