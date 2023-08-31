#!/bin/bash

# Define the list of codes
cu_codes=(
  "core-units/GOV-001"
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
)

ecosystem_codes=(
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

# Define the start and end dates (in year/month format)
start_date="2023/01"
end_date="2023/07"

# Helper function to increment the date by one month
increment_date() {
  current_date="$1"
  year=${current_date:0:4}
  month=${current_date:5:2}

  next_month=$((10#$month + 1)) # Use base 10 to avoid treating leading zeros as octal
  next_year=$year

  if [ $next_month -gt 12 ]; then
    next_month=1
    next_year=$((year + 1))
  fi

  printf -v next_date "%04d/%02d" "$next_year" "$next_month"
  echo "$next_date" # Output the updated date
}


# Helper function to check if a date is after or equal to start_date
is_after_or_equal_start_date() {
  [[ "$1" > "$start_date" || "$1" == "$start_date" ]]
}

# Run the ecosystem actors codes only from April 2023 onwards
for code in "${cu_codes[@]}"; do
  current_date="2021/05"
  while [[ "$current_date" != "$end_date" ]]; do
    node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$current_date"
    current_date=$(increment_date "$current_date")  # Update current_date using the function
  done
  node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$end_date"
done


# Run the ecosystem actors codes only from April 2023 onwards
for code in "${ecosystem_codes[@]}"; do
  current_date="$start_date"
  while [[ "$current_date" != "$end_date" ]]; do
    node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$current_date"
    current_date=$(increment_date "$current_date")  # Update current_date using the function
  done
  node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$end_date"
done
