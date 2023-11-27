Description:
    The grid component is a reusable grid or table component which supports multiple high level features.

Features:
    1. Row-data
    2. Column-header
    3. Filter
    4. Sorting (up/down)
    5. Checkbox
    6. Pagination: Client-side
    7. Pagination: Server-side
    8. Collapsible rows
    9. Buttons in Rows


FEATURE'S GUIDE:

************************************* ROW-DATA *************************************
Prop name: rowData={array-of-row-objects} 

Mandatory: 'id' field is Mandatory. If id field is not present in existing rowdata then push to rowdata.
Create Rowdata (array of Objects), each object will have column names and respective values. If any columnn value is -
not present in a particular row of data, that field can be excempted from the row object. The order of display of data
in the grid is not as per rowdata. It is as per the column data and order specified for column data

let rowData = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, fullName: "Full1" },
        { id: 2, lastName: 'Lannister', age: 42, firstName: 'Cersei', fullName: "Full2" },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 453, fullName: "Full3" },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 455, fullName: "Full4" },
        { id: 5, lastName: 'Targaryen', fullName: "Full5" },
        { id: 6, lastName: 'Melisandre', age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 456, fullName: "Full7" },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, fullName: "Full8" },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, fullName: "Full9" }
    ]
---------------------------------------------------------------------------------------------------------------------------------

************************************* COLUMN-HEADER *************************************
Prop name: columnHeaders={array-of-column-objects} 

Mandatory: 'id' field is Mandatory. If 'id' field is not present and is pushed to rowdata then create object with property 
'id' for coldata as shown below.

const columnHeaders = [
    { field: 'id', headerName: 'ID', width: '70px', sortable: true, visible: true},
    { field: 'lastName', headerName: 'Last name', width: '130px', sortable: true, },
    { field: 'firstName', headerName: 'First name', width: '130px', sortable: true, },
    { field: 'age', headerName: 'Age', width: '90px', sortable: true },
    { field: 'fullName', headerName: 'Full name', description: 'This column is not sortable.', sortable: false, width: '120px'
    }
];

Properties:
    1. field: Name of the field used for coding
    2. headerName: Name of column to be displayed in the screen
    3. width: width of the entire column (Note: If no width is specified then 'width = auto' will be set)
    4. sortable: whether the sort option is visible of not
    5. visible: By default 'visible = true'. Make 'visible = false' to hide entire column from screen. 
                (Note: for tables where 'id' is not required to be shown in screen, use visible false)
---------------------------------------------------------------------------------------------------------------------------------

************************************* FILTER *************************************
    1. Prop name: filter={true} 
---------------------------------------------------------------------------------------------------------------------------------

************************************* SORTING *************************************
    1. Make 'sortable=true' in column headers
---------------------------------------------------------------------------------------------------------------------------------

************************************* CHECKBOX *************************************
    1. Prop name: checkbox={true} 
    2. Checkbox comes along with select-all/unselect-all checkbox
    3. For checkbox to work as expected 'id' field is mandatory. (Can be visible or invisible)
    4. Prop name: selectedCheckboxes={selectedCheckboxesFunction} 
    5. Pass a function to this prop (selectedCheckboxes). This function should have two parameters which will return the
         array of selected checkbox rows (selectedRows) and whether selectAllCheckbox is true or false. For Example:
         Eg:        const selectedCheckboxesFunction = (selectedRows, selectAllCheckboxFlag) => {
                        console.log("selectedRows", selectedRows);
                    }         
                    // Whenver any checkbox is selected/unselected 'selectedRows' will return the row object.
                    // For multiple checkbox selection 'selectedRows' will be Array-of-Objects.
                    // Default value is empty array []                         
---------------------------------------------------------------------------------------------------------------------------------

************************************* PAGINATION: CLIENT-SIDE *************************************
    1. Prop name: paginationType={'client-side'} // default = 'client-side', if prop is not specified
    2. Prop name: rowsPerPage={positive-integer} // default = 8, if prop is not specified
    3. Prop name: totalRows={rowData.length}
    4. Prop name: pageRangeDisplayed={any-positive-integer} // default = 5, if prop is not specified
---------------------------------------------------------------------------------------------------------------------------------

************************************* PAGINATION: SERVER-SIDE *************************************
    1. Prop name: paginationType={'server-side'} // default = 'client-side', if prop is not specified
    2. Prop name: rowsPerPage={any-positive-integer} // default = 8, if prop is not specified
    3. Prop name: totalRows={positive-integer} (Note: The total number of data, to be sent from the API )
    4. Prop name: pageRangeDisplayed={any-positive-integer} // default = 5, if prop is not specified
    5. Prop name: handleServersidePagination={handleServersidePaginationFunction}
    6. Pass a function to this prop (handleServersidePagination). This function can have only single parameter which will
         return the currently selected page number (pageNumber). For Example:

         Eg:        const handleServersidePagination = (pageNumber) => {
                        console.log("pageNumber", pageNumber)
                        const rowData = [
                            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, fullName: "Full1" },
                            { id: 2, lastName: 'Lannister', age: 42, firstName: 'Cersei', fullName: "Full2" },
                            { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 453, fullName: "Full3" },
                            { id: 4, lastName: 'Stark', firstName: 'Arya', age: 455, fullName: "Full4" },
                            { id: 5, lastName: 'Targaryen', fullName: "Full5" }];
                        gridRef.current.updateServerSideRows(rowData);
                    }       
                    // 'rowData' is the variable used to update the data with data received from server.
                    //  gridRef.current.updateServerSideRows(rowData) : Pass the new rows to be updated.
    7. Prop name: ref={gridRef} (Note: create a ref called gridRef and pass it to the gridComponent)
    8. 'ref' is used to trigger the grid update after new data is received from API.
    9. For functional component: 'const gridRef = React.useRef(null)' (Note: inside function component before return)
    10. For class component: 'this.gridRef = React.createRef()' (Note: inside constructor)
---------------------------------------------------------------------------------------------------------------------------------

************************************* COLLAPSIBLE *************************************
    1. Prop name: collapsible={true} 
    2. Create the required HTML element for corresponding row and add to 'collapse' property of rowData.

        Eg:     const collapseArea = <div style={{ width: '200px', height: '200px', border: '1px solid red' }}>
                                            This is collapse area with data
                                         </div>

                let rowData = [{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, fullName: "Full1", collapse: collapseArea },
                                { id: 2, lastName: 'Lannister', age: 42, firstName: 'Cersei', fullName: "Full2" }]


---------------------------------------------------------------------------------------------------------------------------------

************************************* BUTTONS IN ROWS *************************************
    1. Create the button variable using an <img /> tag with any variable name as shown below:
        
        const tableButton1 = <img src={btnIcon} alt="table-button" name="tableButton" width="20" height="20" />
    
    2. src = The icon that should be used for the button.
    3. alt="table-button"
    4. name="tableButton" => Take care that name is always tableButton, else the button will not work.
    5. Add other html attributes like height and width as required.
    6. In columnHeaders add a new object for this button with button variable name as 'field' value as shown below:

        { field: 'button1', headerName: '', width: '90px', sortable: false }
       
        columnHeaders = [...columnHeaders, { field: 'button1', headerName: '', width: '90px', sortable: false }]
    
    7. Inject 'button1' to all rows in rowData that requires button and assign the variable as value for it as shown below:

        Modified ROWDATA => { id: 2, lastName: 'Lannister', age: 42, firstName: 'Cersei', fullName: "Full2", button1: tableButton1 }

    8. Prop name: tableButtonClicked={this.tableButtonClicked} 
    9. Pass a function to this prop (selectedCheckboxes). This function can have only single parameter which will return the
         data for the row in which the button is added (rowData). For Example:

         Eg:        const tableButtonClicked = (rowData) => {
                        console.log("rowData", rowData);
                    }     

    10. Using similar process any number of buttons can be added to the grid as shown below:

        const tableButton1 = <img src={btnIcon} alt="table-button" name="tableButton" width="20" height="20" />

        const tableButton2 = <img src={btnIcon2} alt="table-button" name="tableButton" width="20" height="20" />

        {... any number of similar buttons can be created as per requirement}

        let rowData = [
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, fullName: "Full1", collapse: collapseArea1, button1: tableButton1, button2: tableButton2 },
            { id: 2, lastName: 'Lannister', age: 42, firstName: 'Cersei', fullName: "Full2", button1: tableButton1, button2: tableButton2 }
        ];

        const columnHeaders = [
            { field: 'id', headerName: 'ID', width: '70px', sortable: true, visible: true },
            { field: 'lastName', headerName: 'Last name', width: '130px', sortable: true },
            { field: 'firstName', headerName: 'First name', width: '130px', sortable: true },
            { field: 'age', headerName: 'Age', width: '90px', sortable: true },
            { field: 'fullName', headerName: 'Full name', description: 'something...', sortable: true, width: '120px'},
            { field: 'button1', headerName: '', width: '90px', sortable: false },
            { field: 'button2', headerName: '', width: '90px', sortable: false }
        ];

---------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------- END ---------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------

