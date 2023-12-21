#!/bin/bash

ecosystem_codes=(
  "core-units/SES-001"
)

# Define the start and end dates (in year/month format)
start_date="2023/03"
end_date="2023/12"

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
  current_date="2023/04"
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
  node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$end_date" 17017663
done
