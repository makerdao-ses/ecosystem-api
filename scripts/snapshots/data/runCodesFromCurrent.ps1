#!/usr/bin/env pwsh

# Define the list of codes
$codes = @(
    "ecosystem-actors/BAL-001",
    "ecosystem-actors/CHL-001",
    "ecosystem-actors/DEW-001",
    "ecosystem-actors/JTS-001",
    "ecosystem-actors/PHX-001",
    "ecosystem-actors/PUL-001",
    "ecosystem-actors/SSA-001",
    "ecosystem-actors/TCH-001",
    "ecosystem-actors/VPAC-001",
    "ecosystem-actors/JSK-001",
    "ecosystem-actors/EGE-001",
    "ecosystem-actors/AAVE-001",
    "ecosystem-actors/PH-001",
    "core-units/DAIF-001",
    "scopes/SUP",
    "scopes/ACC",
    "scopes/PRO",
    "scopes/STA",
    "aligned-delegates",
    "delegates",
    "keepers",
    "spfs"
)

$TECH_end_number = 17983665
$DEL_end_number = 16989766

# Get the current date in UTC
$current_utc_date = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd")
$current_year = (Get-Date).ToUniversalTime().Year
$current_month = (Get-Date).ToUniversalTime().Month

# Get the day of the month from the current UTC date
$day_of_month = (Get-Date).ToUniversalTime().Day

# Define months for PREVIOUS and CURRENT iterations
if ($day_of_month -lt 10) {
    if ($current_month -eq 1) {
        $months = @("11", "12")
        $years = @(($current_year - 1), ($current_year - 1))
    }
    elseif ($current_month -eq 2) {
        $months = @("12", ("0" + ($current_month - 1)))
        $years = @(($current_year - 1), $current_year)
    }
    elseif ($current_month -eq 10) {
        $months = @(("0" + ($current_month - 2)), ("0" + ($current_month - 1)))
        $years = @($current_year, $current_year)
    }
    elseif ($current_month -eq 11) {
        $months = @(("0" + ($current_month - 2)), ($current_month - 1))
        $years = @($current_year, $current_year)
    }
    elseif ($current_month -eq 12) {
        $months = @(($current_month - 2), ($current_month - 1))
        $years = @($current_year, $current_year)
    }
    else {
        $previous_month = $current_month - 2
        $previous_month = "0" + $previous_month
        $current_month = $current_month - 1
        $current_month = "0" + $current_month
        $months = @($previous_month, $current_month)
        $years = @($current_year, $current_year)
    }
}
else {
    if ($current_month -eq 1) {
        $months = @("12", $current_month)
        $years = @(($current_year - 1), $current_year)
    }
    elseif ($current_month -eq 10) {
        $months = @("9", "10")
        $years = @($current_year, $current_year)
    }
    elseif ($current_month -gt 10) {
        $months = @(($current_month - 1), $current_month)
        $years = @($current_year, $current_year)
    }
    else {
        $previous_month = $current_month - 1
        $previous_month = "0" + $previous_month
        $months = @($previous_month, ("0" + $current_month))
        $years = @($current_year, $current_year)
    }
}

# Loop through PREVIOUS and CURRENT iterations
for ($i = 0; $i -lt 2; $i++) {
    $previous_month = $months[$i]
    $previous_year = $years[$i]
    $year_month_date = "$previous_year/$previous_month"

    Write-Output "Running for: $year_month_date"

    # Run the ecosystem actors codes only from April 2023 onwards
    foreach ($code in $codes) {
        if ($code -eq "core-units/TECH-001") {
            node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" $year_month_date $TECH_end_number
        }
        elseif ($code -eq "delegates") {
            node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" $year_month_date $DEL_end_number
        }
        else {
            node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" $year_month_date
        }
    }
}