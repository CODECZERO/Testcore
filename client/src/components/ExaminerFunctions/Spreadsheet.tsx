import React from 'react';
import ReactSpreadsheet, { Matrix } from 'react-spreadsheet';

type SpreadsheetData = ({ value: string } | undefined)[][];

interface SpreadsheetProps {
  data: SpreadsheetData;
  onChange: (data: SpreadsheetData) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ data, onChange }) => {
  // Add a new row to the spreadsheet
  const addRow = () => {
    const newRow = Array(data[0].length).fill({ value: '' });
    onChange([...data, newRow]);
  };

  // Add a new column to the spreadsheet
  const addColumn = () => {
    const updatedData = data.map((row) => [...row, { value: '' }]);
    onChange(updatedData);
  };

  return (
    <div>
      <h3>Timetable (Subjects)</h3>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={addRow} style={{ marginRight: '5px' }}>
          Add Row
        </button>
        <button onClick={addColumn}>Add Column</button>
      </div>

      <ReactSpreadsheet
        data={data}
        onChange={(newData: Matrix<{ value: string } | undefined>) => {
          const sanitizedData = newData.map((row) =>
            row.map((cell) => cell || { value: '' })
          );
          onChange(sanitizedData);
        }}
      />
    </div>
  );
};

export default Spreadsheet;

