#!/bin/bash

# Define the list of codes
codes=(
  "ecosystem-actors/JETSTREAM"
)


TECH_end_number=17983665

# Get the current date in UTC
current_utc_date=$(date -u +'%Y-%m-%d')
current_year=$(date -u +'%Y')
current_month=$(date -u +'%m')

# Get the day of the month from the current UTC date
day_of_month=$(date -u +'%d')

# Define months for PREVIOUS and CURRENT iterations
if [ "$day_of_month" -lt 10 ]; then
  if [ "$current_month" -eq 1 ]; then
    months=("12" "$current_month")
    years=("$((current_year - 1))" "$current_year")
  else
    if [ "$current_month" -eq 10 ]; then
      months=("0$((current_month - 2))" "0$((current_month - 1))")
      years=("$current_year" "$current_year")
    else
      if [ "$current_month" -eq 11 ]; then
        months=("0$((current_month - 2))" "$((current_month - 1))")
        years=("$current_year" "$current_year")
      else
        if [ "$current_month" -eq 12 ]; then
          months=("$((current_month - 2))" "$((current_month - 1))")
          years=("$current_year" "$current_year")
        else
          previous_month=$((${current_month#0} - 2))
          previous_month="0$previous_month"
          current_month=$((${current_month#0} - 1))
          current_month="0$current_month"
          months=("$previous_month" "$current_month")
          years=("$current_year" "$current_year")
        fi
      fi
    fi
  fi
else
  if [ "$current_month" -eq 1 ]; then
    months=("12" "$current_month")
    years=("$((current_year - 1))" "$current_year")
  else
    if [ "$current_month" -eq 10 ]; then
    months=("0$((current_month - 1))" "$current_month")
    years=("$current_year" "$current_year")
    else
      if [ "$current_month" -gt 9 ]; then
        months=("$((current_month - 1))" "$current_month")
        years=("$current_year" "$current_year")
      else
        previous_month=$((${current_month#0} - 1))
        previous_month="0$previous_month"
        months=("$previous_month" "$current_month")
        years=("$current_year" "$current_year")
      fi
    fi
  fi
fi
# Loop through PREVIOUS and CURRENT iterations
for i in 0 1; do
  previous_month=${months[$i]}
  previous_year=${years[$i]}
  year_month_date="$previous_year/$previous_month"

  echo "Running for: $year_month_date"

  # Run the ecosystem actors codes only from April 2023 onwards
  for code in "${codes[@]}"; do
    if [ "$code" = "core-units/TECH-001" ]; then
      node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$year_month_date" "$TECH_end_number"
    else
      node ./scripts/snapshots/syncSnapshotReport.js "makerdao/$code" "$year_month_date"
    fi
  done
done