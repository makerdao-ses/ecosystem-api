#!/bin/bash

# Define the list of codes
codes=(
  "core-units/GOV-001"
  "core-units/SES-001"
  "core-units/SAS-001"
  "core-units/IS-001"
  "core-units/RWF-001"
  "core-units/GRO-001"
  "core-units/ORA-001"
  "core-units/COM-001"
  "core-units/DAIF-001"
  "core-units/SH-001"
  "core-units/DUX-001"
  "core-units/SNE-001"
  "core-units/DIN-001"
  "core-units/DECO-001"
  "core-units/SF-001"
  "core-units/TECH-001"
  "core-units/EVENTS-001"
  "core-units/CES-001"
  "core-units/PE-001"
  "core-units/RISK-001"
  "delegates"
  "spfs/SPF1"
  "spfs/SPF3"
  "spfs/SPF7"
  "ecosystem-actors/BA-LABS"
  "ecosystem-actors/CHRONICLE"
  "ecosystem-actors/DEWIZ"
  "ecosystem-actors/JETSTREAM"
  "ecosystem-actors/PHOENIX"
  "ecosystem-actors/PULLUP"
  "ecosystem-actors/SIDESTREAM"
  "ecosystem-actors/TECHOPS"
  "ecosystem-actors/VIRIDIAN"
)

# Get the current date in UTC
current_utc_date=$(date -u +'%Y-%m-%d')
current_year=$(date -u +'%Y')
current_month=$(date -u +'%m')

# Get the day of the month from the current UTC date
day_of_month=$(date -u +'%d')

# Calculate the previous month and year
if [ "$day_of_month" -lt 10 ]; then
  if [ "$current_month" -eq 1 ]; then
    previous_month=12
    previous_year=$((current_year - 1))
  else
    previous_month=$((${current_month#0} - 1))
    previous_month="0$previous_month"
    previous_year=$current_year
  fi
else
  previous_month=$current_month
  previous_year=$current_year
fi

# Construct the date in "YYYY/MM" format for the previous month
year_month_date="$previous_year/$previous_month"

# Run the ecosystem actors codes only from April 2023 onwards
for code in "${codes[@]}"; do
  node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$year_month_date"
done