import React, { Component } from 'react';
import GridComponent from './Grid/GridComponent';

let rowData = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, fullName: "Full1" },
  { id: 2, lastName: 'Lannister', age: 42, firstName: 'Cersei', fullName: "Full2" },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 453, fullName: "Full3" },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 455, fullName: "Full4" },
  { id: 5, lastName: 'Targaryen', fullName: "Full5" },
  { id: 6, lastName: 'Melisandre', age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 456, fullName: "Full7" },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, fullName: "Full8" },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, fullName: "Full9" },

  { id: 10, lastName: 'Snow', firstName: 'Jon', age: 35, fullName: "Full1" },
  { id: 11, lastName: 'Snow', firstName: 'Jon', age: 35, fullName: "Full1" },
  { id: 12, lastName: 'Lannister', age: 42, firstName: 'Cersei', fullName: "Full2" },
  { id: 13, lastName: 'Lannister', firstName: 'Jaime', age: 453, fullName: "Full3" },
  { id: 14, lastName: 'Stark', firstName: 'Arya', age: 455, fullName: "Full4" },
  { id: 15, lastName: 'Targaryen', firstName: 'Daenerys', fullName: "Full5" },
  { id: 16, lastName: 'Melisandre', age: 150 },
  { id: 17, lastName: 'Clifford', firstName: 'Ferrara', age: 456, fullName: "Full7" },
  { id: 18, lastName: 'Frances', firstName: 'Rossini', age: 36, fullName: "Full8" },
  { id: 19, lastName: 'Roxie', firstName: 'Harvey', age: 65, fullName: "Full9" }
];

const columnHeaders = [
  { field: 'id', headerName: 'ID', width: '70px', sortable: true, },
  { field: 'lastName', headerName: 'Last name', width: '130px', sortable: true, },
  { field: 'firstName', headerName: 'First name', width: '130px', sortable: true, },
  { field: 'age', headerName: 'Age', width: '90px', sortable: true },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: true,
    width: '120px'
  }
];

const collapseArea = <div style={{ width: '200px', height: '200px', border: '1px solid red' }}>hi</div>

const App = () => {
  const handleServersidePagination = (pageNumber) => {
    console.log("CALLED server")
    const rowData = [
      { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, fullName: "Full1" },
      { id: 2, lastName: 'Lannister', age: 42, firstName: 'Cersei', fullName: "Full2" },
      { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 453, fullName: "Full3" },
      { id: 4, lastName: 'Stark', firstName: 'Arya', age: 455, fullName: "Full4" },
      { id: 5, lastName: 'Targaryen', fullName: "Full5" }];
    gridRef.current.updateRows(rowData);
  }
  const gridRef = React.useRef(null);
  return (
    <div className="main-section">
      <GridComponent
        ref={gridRef}
        rowData={rowData}
        columnHeaders={columnHeaders}
        checkbox={true}
        collapsible={true}
        collapseArea={collapseArea}
        filter={true}
        paginationType={'client-side'}
        handleServersidePagination={handleServersidePagination}
      />
    </div>
  );
}

export default App;


