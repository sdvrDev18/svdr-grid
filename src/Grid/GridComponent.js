import React, { Component } from 'react';
import filterIcon from '../Images/filter-outline.svg';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import GridFilter from './GridFilter';
import Pagination from "react-js-pagination";

export default class GridComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleTooltip: false,
            toolTipId: '',
            columnHeaders: this.props.columnHeaders,
            rowData: this.props.rowData,
            filterApplied: false,
            isCollapseOpen: false,
            collapsibleId: 0,
            pageNumber: 1,
            rowsPerPage: 8,
            rowsPerPageOptions: [],
            selectAllCheckboxes: false,
            activePage: '',
            isSorted: false,
            sortedData: []
        }
    }

    componentDidMount() {
        if (this.props.rowData.length >= this.state.rowsPerPage) this.setPageData();
        const rowsQuotient = Math.floor(this.props.rowData.length / 8);
        console.log('this.props.rowData.length', this.props.rowData.length)
        console.log('rowsQuotient', rowsQuotient)
        let rowsPerPageOptions = [];
        if (rowsQuotient >= 1) {
            for (let i = 1; i <= rowsQuotient; i++) {
                rowsPerPageOptions = [...rowsPerPageOptions, i * 8];
            }
        }
        else if (rowsQuotient = 0) {
            rowsPerPageOptions = [8];
        }
        console.log('rowsPerPageOptions', rowsPerPageOptions)
        this.setState({
            rowsPerPageOptions: rowsPerPageOptions,
            activePage: rowsQuotient
        })
    }

    updateRows = (rowdata) => {
        this.setState({
            rowData: rowdata
        })
    }

    setPageData = () => {
        const paginatedRowData = this.props.rowData.filter((eachRow, rowIndex) => rowIndex <= this.state.rowsPerPage - 1)
        this.setState({ rowData: paginatedRowData })
    }

    handleTooltipOpen = (id, currentState) => {
        if (currentState !== null) {
            this.setState({
                toggleTooltip: currentState,
                toolTipId: id,
                filterApplied: false
            });
        }
        else if (currentState === null) {
            this.setState({
                toggleTooltip: true,
                toolTipId: id,
                filterApplied: false
            });
        }
    };

    handleApplyFilter = (column, operator, value) => {
        let filteredTable = [];
        if (operator === 'Contains') {
            filteredTable = this.props.rowData && value !== '' ? this.props.rowData.filter(val => {
                if (val[column] && Number(val[column])) return val[column] && val[column].toString().includes(value)
                else return val[column] && val[column].toLowerCase().includes(value.toLowerCase())
            }) : this.state.rowData;
            console.log("filter contains operation", filteredTable)
        }
        else if (operator === 'Equals') {
            filteredTable = this.props.rowData && value !== '' ? this.props.rowData.filter(val => {
                if (val[column] && Number(val[column])) return val[column] && val[column].toString() === value
                else return val[column] && val[column].toLowerCase() === value.toLowerCase()
            }) : this.state.rowData;
            console.log("filter equals operation", filteredTable)
        }
        this.setState({
            toggleTooltip: false,
            rowData: filteredTable ? filteredTable : this.props.rowData,
            filterApplied: true
        });

    }

    handleResetTable = () => {
        this.setState({
            toggleTooltip: false,
            toolTipId: '',
            columnHeaders: this.props.columnHeaders
        })
        this.setPageData()
    }

    handlePageChange = (event) => {
        if (this.props.paginationType === 'server-side') {
            this.props.handleServersidePagination(event);
        }
        else {
            const { rowsPerPage, activePage } = this.state;
            const paginatedRowData = this.state.isSorted ? this.state.sortedData.slice((event - 1) * 8, (event) * 8) : this.props.rowData.slice((event - 1) * 8, (event) * 8)
            console.log('paginatedRowData', paginatedRowData)
            this.setState({ pageNumber: event, rowData: paginatedRowData })
        }
    }

    // handleChangeRowsPerPage = (event) => {
    //     this.setState({ rowsPerPage: event.target.value, pageNumber: 0 })
    // }

    toggleCollapsible = (rowIndex) => this.setState(prevState => ({ isCollapseOpen: !prevState.isCollapseOpen, collapsibleId: rowIndex }))

    sortUp = (index) => {
        let allColumns = this.state.columnHeaders;
        const sortColumn = allColumns[index].field;
        let sortedObj = [...this.props.rowData];
        sortedObj.sort(function (first, second) {
            const firstValue = !Number(first[sortColumn]) ? first[sortColumn] ? first[sortColumn].toUpperCase() : '' : Number(first[sortColumn]); // ignore upper and lowercase
            const secondValue = !Number(second[sortColumn]) ? second[sortColumn] ? second[sortColumn].toUpperCase() : '' : Number(second[sortColumn]); // ignore upper and lowercase
            if (!firstValue && !secondValue) {
                return 0;
            }
            else if (firstValue && secondValue) {
                if (firstValue < secondValue) {
                    return -1;
                }
                if (firstValue > secondValue) {
                    return 1;
                }
            }
            // names must be equal
            return 0;
        });
        const paginatedRowData = sortedObj.slice((this.state.pageNumber - 1) * 8, (this.state.pageNumber) * 8)
        console.log('sortedObj', sortedObj);
        console.log('paginatedRowData', paginatedRowData);
        this.setState({ rowData: paginatedRowData, isSorted: true, sortedData: sortedObj })
    }

    sortDown = (index) => {
        let allColumns = this.state.columnHeaders;
        const sortColumn = allColumns[index].field;
        let sortedObj = [...this.props.rowData];
        sortedObj.sort(function (first, second) {
            const firstValue = !Number(first[sortColumn]) ? first[sortColumn] ? first[sortColumn].toUpperCase() : '' : Number(first[sortColumn]); // ignore upper and lowercase
            const secondValue = !Number(second[sortColumn]) ? second[sortColumn] ? second[sortColumn].toUpperCase() : '' : Number(second[sortColumn]); // ignore upper and lowercase
            if (!firstValue && !secondValue) {
                return 0;
            }
            else if (firstValue && secondValue) {
                if (firstValue < secondValue) {
                    return 1;
                }
                if (firstValue > secondValue) {
                    return -1;
                }
            }
            // names must be equal
            return 0;
        });
        const paginatedRowData = sortedObj.slice((this.state.pageNumber - 1) * 8, (this.state.pageNumber) * 8)
        console.log('sortedObj', sortedObj);
        console.log('paginatedRowData', paginatedRowData);
        this.setState({ rowData: paginatedRowData, isSorted: true, sortedData: sortedObj });
    }

    handleAllCheckboxes = (event) => {
        const checkboxes = document.getElementsByClassName('table-checkbox');
        for (let checkbox of checkboxes) {
            checkbox.checked = event.target.checked;
        }
    }

    handleCheckbox = (event) => {
        this.setState({
            selectAllCheckboxes: event.target.checked
        })
    }

    render() {
        const columnsArray = this.props.columnHeaders.map(column => column.field);
        const LightTooltip = withStyles((theme) => ({
            tooltip: {
                backgroundColor: theme.palette.common.white,
                color: 'rgba(0, 0, 0, 0.87)',
                boxShadow: theme.shadows[1],
                fontSize: 11,
                height: '70px',
                maxWidth: '1000px',
                boxShadow: '0 0 5px 0',
                padding: '0 5px'
            },
        }))(Tooltip);
        return (
            <React.Fragment>
                <table cellPadding="10" cellSpacing="10" width="100%" style={{ marginBottom: "5px" }} className="table list-view mt15">
                    <thead className='header-footer-style'>
                        <tr>
                            {
                                this.props.checkbox === true && <th style={{ width: '10px', borderRight: '0.5px solid lightgrey' }}>
                                    <input type="checkbox" className="table-checkbox" onClick={this.handleAllCheckboxes} />
                                </th>
                            }
                            {
                                this.state.columnHeaders.map((cols, index) => {
                                    return (
                                        <th id={cols.field} width={cols.width} style={{ borderRight: '0.5px solid lightgrey' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                                <span>{cols.headerName}</span>
                                                {
                                                    cols.sortable === true &&
                                                    <span style={{ display: "inline-grid", alignItems: 'center' }}>
                                                        <span className="table-sort-up-button" onClick={() => this.sortUp(index)}></span>
                                                        <span className="table-sort-down-button" onClick={() => this.sortDown(index)}></span>
                                                    </span>
                                                }
                                            </div>
                                        </th>
                                    )
                                })
                            }
                            {
                                this.props.filter === true && <th style={{ width: '10px'}}>
                                    <LightTooltip
                                        open={this.state.toggleTooltip}
                                        interactive
                                        title={
                                            <GridFilter
                                                handleApplyFilter={this.handleApplyFilter}
                                                columnHeaders={this.props.columnHeaders}
                                                handleResetTable={this.handleResetTable}
                                            />
                                        }
                                        disableFocusListener
                                        disableHoverListener
                                        disableTouchListener
                                    >
                                        <img
                                            id="filter-id"
                                            src={filterIcon}
                                            width="13"
                                            height="13"
                                            onClick={() => this.handleTooltipOpen(null, !this.state.toggleTooltip)}
                                        />
                                    </LightTooltip>
                                </th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.rowData.map((rows, rowIndex) => {
                                return (
                                    <React.Fragment>
                                        <tr>
                                            {
                                                this.props.checkbox === true &&
                                                <td style={{ borderRight: '0.5px solid lightgrey', textAlign: 'center' }}>
                                                    <input
                                                        onClick={this.handleCheckbox}
                                                        value={this.state.selectAllCheckboxes}
                                                        type="checkbox"
                                                    />
                                                </td>
                                            }
                                            {
                                                columnsArray.map(el => {
                                                    return (
                                                        <td
                                                            onClick={() => this.toggleCollapsible(rowIndex)}
                                                            style={{ textAlign: 'center', borderRight: '0.5px solid lightgrey' }}
                                                        >
                                                            {rows[el]}
                                                        </td>
                                                    )
                                                })
                                            }
                                            {
                                                this.props.filter === true && <td></td>
                                            }
                                        </tr>
                                        {
                                            this.state.collapsibleId === rowIndex &&
                                            <tr className={this.props.collapsible && this.state.isCollapseOpen ? "collapsible_visible" : "collapsible_invisible"}>
                                                <td colSpan={columnsArray.length}>
                                                    {this.props.collapseArea}
                                                </td>
                                            </tr>
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                </table >
                <div className="header-footer-style table-pagination">
                    <Pagination
                        totalItemsCount={this.props.rowData.length}
                        activePage={this.state.pageNumber}
                        onChange={this.handlePageChange}
                        itemsCountPerPage={8}
                        pageRangeDisplayed={8}
                    />
                </div>
            </React.Fragment>
        )
    }
}


