
function updateBattery(dataJSON) {
  let batteryClass = 'dashboard-battery_charge';
  if (!dataJSON.CHARGE_ENABLED) {
    if (dataJSON.BATT_CHARGE.last_value <= 10) {
      batteryClass = 'dashboard-battery_low';
    } else if (dataJSON.BATT_CHARGE.last_value < 50) {
      batteryClass = 'dashboard-battery_medium';
    } else {
      batteryClass = 'dashboard-battery_full';
    }
  }
  $('.dashboard-battery').removeClass('dashboard-battery_low dashboard-battery_medium dashboard-battery_full dashboard-battery_charge').addClass(batteryClass);
}


export default updateBattery;
