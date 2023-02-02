/** 
 * @type {import('jest').Config} 
 */
export default {
    "verbose": true,
    "roots": [
        "./src/"
    ],
    "moduleDirectories": [
        "node_modules"
    ],
    "transform": {
        '\\.[jt]sx?$': [
            'ts-jest',
            {
                tsconfig: './config/tsconfig.json',
                compiler: 'typescript'
            }
        ]
    },
    // See https://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1068342692
    "moduleNameMapper": {
        "(.+)\\.js": "$1"
    },
    "collectCoverage": true,
    "coverageDirectory": "coverage",
};