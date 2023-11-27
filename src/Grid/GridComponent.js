import React, { Component } from 'react';
import filterIcon from '../Images/filter-outline.svg';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import GridFilter from './gridFilter';
import Pagination from 'react-js-pagination';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export default class GridComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleTooltip: false,
      columnHeaders: this.props.columnHeaders && this.props.columnHeaders,
      rowData: this.props.rowData && this.props.rowData,
      filterApplied: false,
      isCollapseOpen: false,
      collapsibleId: 0,
      pageNumber: 1,
      rowsPerPage: Math.floor(Number(this.props.rowsPerPage)),
      isSorted: false,
      filterError: false,
      selectedRows: this.props.checkBoxArray && this.props.checkBoxArray.length > 0 ? this.props.checkBoxArray.map((el) => this.props.rowData.filter((val) => val.id === el)[0]) : [],
      selectAllCheckbox: false,
      checkBoxArray: this.props.checkBoxArray,
      currentPageData: [],
      totalRows: this.props.totalRows,
      collapseArea: '',
      pageSearchInput: 0,
      isClearPageInput: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    let diffArray;
    if(this.props.rowData.length > nextProps.rowData.length || this.props.rowData.length === nextProps.rowData.length)
      diffArray = _.differenceWith(this.props.rowData, nextProps.rowData, _.isEqual);
    else if(this.props.rowData.length < nextProps.rowData.length)
      diffArray = _.differenceWith(nextProps.rowData, this.props.rowData, _.isEqual);
    if (diffArray && diffArray.length > 0) {
      this.setState({
        rowData: nextProps.rowData,
        checkBoxArray: nextProps.checkBoxArray && nextProps.checkBoxArray.length > 0 ? nextProps.checkBoxArray : [],
        totalRows: nextProps.totalRows,
        selectAllCheckbox : nextProps.checkBoxArray && nextProps.checkBoxArray.length === 0 ? false : this.state.selectAllCheckbox
      });
      if (nextProps.rowData.length !== this.state.rowsPerPage) this.setPageData(nextProps.rowData,nextProps.totalRows);
    }
  }

  componentDidMount() {
    if (this.props.rowData.length != this.state.rowsPerPage) this.setPageData(this.props.rowData);
    if (this.props.checkBoxArray && this.props.checkBoxArray.length === this.props.rowData.length) this.setState({ selectAllCheckbox: true });
  }

  updateServerSideRows = (rowdata) => {
    this.setState({
      rowData: rowdata,
    });
  };

  setPageData = (data,totalRows) => {
    const paginatedRowData = data.slice(0, this.state.rowsPerPage);
    if (this.props.paginationType === 'server-side') {
      this.setState({
        rowData: paginatedRowData,
        currentPageData: data,
        pageNumber: totalRows > this.state.rowsPerPage ? this.state.pageNumber : 1,
      });
    } else if (this.props.paginationType === 'client-side') {
      this.setState({
        rowData: paginatedRowData,
        currentPageData: data,
        totalRows: Math.ceil(data.length),
        pageNumber: 1,
      });
    }
  };

  handleTooltipOpen = (currentState) => {
    if (currentState !== null) {
      this.setState({
        toggleTooltip: currentState,
        filterApplied: false,
      });
    } else if (currentState === null) {
      this.setState({
        toggleTooltip: true,
        filterApplied: false,
      });
    }
  };

  handleApplyFilter = (column, operator, value) => {
    let filteredTable = [];
    if (operator === 'Contains') {
      filteredTable =
        this.props.rowData && value !== ''
          ? this.props.rowData.filter((val) => {
              if (val[column] && Number(val[column])) {
                return val[column] && val[column].toString().includes(value);
              } else {
                return val[column] && val[column].toLowerCase().includes(value.toLowerCase());
              }
            })
          : this.props.rowData;
    } else if (operator === 'Equals') {
      filteredTable =
        this.props.rowData && value !== ''
          ? this.props.rowData.filter((val) => {
              if (val[column] && Number(val[column])) return val[column] && val[column].toString() === value;
              else return val[column] && val[column].toLowerCase() === value.toLowerCase();
            })
          : this.state.rowData;
    }
    if (filteredTable.length === 0) {
      this.handleFilterNoResult();
    } else {
      this.setState({
        toggleTooltip: false,
        rowData: filteredTable,
        filterApplied: true,
      });
      this.setPageData(filteredTable);
    }
  };

  handleFilterNoResult = () => {
    this.setState({
      filterError: true,
    });
  };

  handleResetTable = () => {
    this.setState({
      toggleTooltip: false,
      columnHeaders: this.props.columnHeaders,
      filterError: false,
      pageNumber: 1,
      selectedRows: [],
      selectAllCheckbox: false,
      checkBoxArray: [],
    });
    this.setPageData(this.props.rowData);
  };

  handlePageChange = (event) => {
    this.state.pageSearchInput !== 0 && this.clearPageSearch();
    if (this.props.paginationType === 'server-side') {
      this.setState({ pageNumber: event, isCollapseOpen: false });
      this.props.handleServersidePagination(event);
    } else {
      const paginatedRowData =
        this.state.currentPageData.length !== 0
          ? this.state.currentPageData.slice((event - 1) * this.state.rowsPerPage, event * this.state.rowsPerPage)
          : this.props.rowData.slice((event - 1) * this.state.rowsPerPage, event * this.state.rowsPerPage);
      this.setState({ pageNumber: event, rowData: paginatedRowData, isCollapseOpen: false, toggleTooltip: false });
    }
  };

  handlePageNumberInput = (e) => {
    const pageInput = Number(e.target.value);
    if (Math.sign(pageInput) === 1) {
      this.setState({ pageNumber: pageInput, pageSearchInput: pageInput, isClearPageInput: true });
      this.handlePageChange(pageInput);
    } else if (e.target.value === '') {
      this.setState({ pageSearchInput: 0, isClearPageInput: false, toggleTooltip: false });
    }
  };

  clearPageSearch = () => {
    if(this.props.paginationType === 'server-side'){
      this.setState({pageNumber : 1}, () => this.props.handleServersidePagination(this.state.pageNumber))
    }
    this.setPageData(this.props.rowData);
    this.setState({ pageSearchInput: 0, isClearPageInput: false });
  };

  handleRowClick = (rowIndex, selectedElement) => {
    if (selectedElement.props && selectedElement.props.name === 'tableButton') {
      this.props.tableButtonClicked(this.state.rowData[rowIndex]);
    } else {
      this.props.collapsibleData(rowIndex, this.state.rowData[rowIndex].id, this.state.isCollapseOpen);
    }
  };

  handleCollapsibleData = (rowIndex, collapseArea) => {
    let collapsibleId;
    this.props.rowData.forEach((val) => {
      if (val.id === this.state.rowData[rowIndex].id) collapsibleId = val.id;
    });
    this.setState((prevState) => ({
      isCollapseOpen: collapseArea === null ? false : !prevState.isCollapseOpen,
      collapsibleId: collapsibleId,
      collapseArea: collapseArea,
    }));
  };

  sortUp = (index) => {
    let allColumns = this.state.columnHeaders;
    const sortColumn = allColumns[index].field;
    let sortedObj = this.state.filterApplied ? [...this.state.currentPageData] : [...this.props.rowData];
    let newSortedObj = sortedObj.filter((val) => val[sortColumn] && val[sortColumn] !== '');
    let nullSortedObj = sortedObj.filter((val) => !val[sortColumn] || val[sortColumn] === '');
    let sortedNullVal = _.sortBy(nullSortedObj, sortColumn);
    newSortedObj.sort(function(first, second) {
      const firstValue = !Number(first[sortColumn]) ? (first[sortColumn] ? first[sortColumn].toLowerCase() : '') : Number(first[sortColumn]); // ignore upper and lowercase
      const secondValue = !Number(second[sortColumn]) ? (second[sortColumn] ? second[sortColumn].toLowerCase() : '') : Number(second[sortColumn]); // ignore upper and lowercase
      if (!firstValue && !secondValue) {
        return 0;
      } else if (firstValue && secondValue) {
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
    let combinedSortedVal = [...newSortedObj, ...sortedNullVal];
    this.setPageData(combinedSortedVal);
    this.setState({ isSorted: true });
  };

  sortDown = (index) => {
    let allColumns = this.state.columnHeaders;
    const sortColumn = allColumns[index].field;
    let sortedObj = this.state.filterApplied ? [...this.state.currentPageData] : [...this.props.rowData];
    let newSortedObj = sortedObj.filter((val) => val[sortColumn] && val[sortColumn] !== '');
    let nullSortedObj = sortedObj.filter((val) => !val[sortColumn] || val[sortColumn] === '');
    let sortedNullVal = _.sortBy(nullSortedObj, sortColumn).reverse();
    newSortedObj.sort(function(first, second) {
      const firstValue = !Number(first[sortColumn]) ? (first[sortColumn] ? first[sortColumn].toLowerCase() : '') : Number(first[sortColumn]); // ignore upper and lowercase
      const secondValue = !Number(second[sortColumn]) ? (second[sortColumn] ? second[sortColumn].toLowerCase() : '') : Number(second[sortColumn]); // ignore upper and lowercase
      if (!firstValue && !secondValue) {
        return 0;
      } else if (firstValue && secondValue) {
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
    let combinedSortedVal = [...newSortedObj, ...sortedNullVal];
    this.setPageData(combinedSortedVal);
    this.setState({ isSorted: true });
  };

  handleAllCheckboxes = (event) => {
    let checkArray = this.state.checkBoxArray;
    if (event.target.checked === true) {
      this.props.rowData.forEach((el) => checkArray.push(el.id));
      this.setState({
          checkBoxArray: checkArray,
          selectAllCheckbox: true,
          selectedRows: this.props.rowData,
        },() => this.props.selectedCheckboxes(this.props.rowData, this.state.selectAllCheckbox));
    } else {
      checkArray = [];
      this.setState({
        checkBoxArray: checkArray,
        selectAllCheckbox: false,
        selectedRows: [],
      },() => this.props.selectedCheckboxes([],this.state.selectAllCheckbox));
    }
  };

  handleCheckbox = (event, rowIndex) => {
    let selectedRows = [...this.state.selectedRows];
    let checkedRow = this.state.rowData[rowIndex];
    let checkArray = this.state.checkBoxArray;

    if (event.target.checked === true) {
      !checkArray.includes(checkedRow.id) && checkArray.push(checkedRow.id);
      this.props.paginationType === 'client-side' && this.props.rowData.length === checkArray.length && this.setState({ selectAllCheckbox: true });
      this.setState({
        checkBoxArray: checkArray,
      });
      // start - Add checkbox value that is added
      selectedRows = [...selectedRows, this.state.rowData[rowIndex]];
    } else {
      checkArray.forEach((val, index) => val === checkedRow.id && checkArray.splice(index, 1));
      this.props.rowData.length !== checkArray.length && this.setState({ selectAllCheckbox: false });
      this.setState({
        checkBoxArray: checkArray,
      });
      // start - remove checkbox value that is added
      const removeRow = selectedRows.map((row, index) => {
        const isObjectEqual = _.isEqual(checkedRow, row);
        if (isObjectEqual) return index;
        else return -1;
      });
      const rowToSplice = removeRow.find((el) => el !== -1);
      selectedRows.splice(rowToSplice, 1);
      // end - remove checkbox value that is added
    }
    this.setState({ selectedRows });
    this.props.selectedCheckboxes(selectedRows);
  };

  render() {
    const lastPage = Math.ceil(this.state.totalRows / this.state.rowsPerPage);
    const columnsArray = this.props.columnHeaders.map((column) => column.visible !== false && column.field).filter((col) => col);
    const noOfColumns = this.props.rowData.length > 0 && Object.keys(this.props.rowData[0]).length;
    const prevPageText = this.state.pageNumber === 1 ? false : '⟨';
    const firstPageText = this.state.pageNumber === 1 ? false : '«';
    const lastPageText = this.state.pageNumber === lastPage ? false : '»';
    const nextPageText = this.state.pageNumber === lastPage ? false : '⟩';
    const LightTooltipWrapper = withStyles((theme) => ({
      tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
        height: 'auto',
        width: 'auto',
        boxShadow: '0 0 5px 0',
        padding: '0 5px',
      },
    }))(Tooltip);
    const LightTooltip = withStyles((theme) => ({
      tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
        height: '70px',
        maxWidth: '1000px',
        boxShadow: '0 0 5px 0',
        padding: '0 5px',
      },
    }))(Tooltip);
    return (
      <React.Fragment>
        <table cellPadding="10" cellSpacing="10" width="100%" style={{ marginBottom: '5px', marginTop: '2px' }} className="table list-view mt15">
          <thead>
            <tr>
              {this.props.checkbox === true && (
                <th key={`multiCheckbox-${uuidv4()}`} style={{ width: '10px', paddingTop: 0, borderRight: '0.5px solid lightgrey' }}>
                  <input type="checkbox" className="table-checkbox" checked={this.state.selectAllCheckbox} onClick={this.handleAllCheckboxes} />
                </th>
              )}
              {this.state.columnHeaders &&
                this.state.columnHeaders.map(
                  (cols, index) =>
                    cols.visible !== false && (
                      <th key={`colHeader-${uuidv4()}`} id={cols.field} width={cols.width} style={{ borderRight: '0.5px solid lightgrey' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <span style={{ marginRight: '7px' }}>{cols.headerName}</span>
                          {cols.sortable === true && (
                            <span style={{ display: 'inline-grid' }}>
                              <span className="table-sort-up-button" onClick={() => this.sortUp(index)} />
                              <span className="table-sort-down-button" onClick={() => this.sortDown(index)} />
                            </span>
                          )}
                        </div>
                      </th>
                    ),
                )}
              {this.props.filter === true && (
                <th key={`LightToolTip-${uuidv4()}`} style={{ width: '10px', paddingTop: 0 }}>
                  <LightTooltipWrapper title="Search Filter" placement="top">
                    <LightTooltip
                      open={this.state.toggleTooltip}
                      interactive
                      title={
                        <GridFilter 
                          handleApplyFilter={this.handleApplyFilter} 
                          filterError={this.state.filterError} 
                          columnHeaders={this.props.columnHeaders} 
                          handleResetTable={this.handleResetTable} 
                        />
                      }
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                    >
                      <img id="filter-id" src={filterIcon} width="13" height="13" style={{ float: 'right' }} onClick={() => this.handleTooltipOpen(!this.state.toggleTooltip)} />
                    </LightTooltip>
                  </LightTooltipWrapper>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {this.state.rowData &&
              this.state.rowData.map((rows, rowIndex) => (
                <React.Fragment>
                  <tr className="grid-row-style">
                    {this.props.checkbox === true && (
                      <td style={{ borderRight: '0.5px solid lightgrey' }}>
                        <input onClick={(event) => this.handleCheckbox(event, rowIndex)} checked={this.state.checkBoxArray.includes(rows.id)} className="table-checkbox" type="checkbox" />
                      </td>
                    )}
                    {columnsArray.map((el) => {
                      return (
                        <td onClick={() => this.handleRowClick(rowIndex, rows[el])} style={{ textAlign: 'center', borderRight: '0.5px solid lightgrey' }}>
                          {rows[el]}
                        </td>
                      );
                    })}
                    {this.props.filter === true && <td />}
                  </tr>
                  {this.state.collapsibleId === rows.id && (
                    <tr className={this.props.collapsible && this.state.isCollapseOpen ? 'collapsible_visible' : 'collapsible_invisible'}>
                      <td colSpan={noOfColumns}>{this.state.collapseArea}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
        <div className="dashboard-pagination table-pagination">
          <Pagination
            hideDisabled
            totalItemsCount={this.state.totalRows}
            activePage={this.state.pageNumber}
            onChange={this.handlePageChange}
            itemsCountPerPage={this.state.rowsPerPage ? this.state.rowsPerPage : 8}
            pageRangeDisplayed={this.props.pageRangeDisplayed ? this.props.pageRangeDisplayed : 5}
            prevPageText={prevPageText}
            firstPageText={firstPageText}
            lastPageText={lastPageText}
            nextPageText={nextPageText}
          />
          <div className="pagination-total-rows-label">Total Records : {this.state.totalRows}</div>
          <div style={{ width: '15%' }}>
            <input
              className="table-pagination-input"
              type="number"
              onChange={this.handlePageNumberInput}
              placeholder="Pagenum..."
              value={this.state.pageSearchInput === 0 ? '' : this.state.pageSearchInput}
            />
            {this.state.isClearPageInput && (
              <button style={{ height: 'auto', width: 'auto' }} type="button" className="close-button-style" data-dismiss="modal" onClick={this.clearPageSearch}>
                <span id="modal-close-btn">&times;</span>
              </button>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
