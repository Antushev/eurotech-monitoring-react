import React from 'react';
import { DayPicker } from 'react-day-picker';
import { ru } from 'react-day-picker/locale'

const Calendar = (props) => {
  const { date, setDate, mode } = props;

  return (
    <DayPicker
      locale={ru}
      ISOWeek
      animate
      showOutsideDays
      required
      mode={ mode }
      selected={ date }
      onSelect={ setDate }
    />
  );
}

export default Calendar;
