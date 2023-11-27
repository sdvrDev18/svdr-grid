import React, { Component } from 'react';
import tickIcon from '../Images/ic_approve_slate.svg';
import closeIcon from '../Images/ic_reject_slate.svg';

export default class GridFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnFilter: this.props.columnHeaders[0].field, //if no value is selected, default value will be first element of array
      operatorFilter: 'Contains', //if no value is selected, default value will be first element = 'Contains'
      valueFilter: '',
    };
  }

  handleFilterItems = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleResetFilter = () => {
    this.setState({
      columnFilter: '',
      operatorFilter: '',
      valueFilter: '',
    });
    this.props.handleResetTable();
  };

  render() {
    const filterOperatorArray = ['Contains', 'Equals'];
    return (
      <div>
        <div className="table-filter-main-section">
          <div className="table-filter-sub-section">
            <label className="table-filter-label" htmlFor="columnFilter">
              Column
            </label>
            <select className="table-filter-dropdown" id="columnFilter" onChange={(e) => this.handleFilterItems(e, 'dropdown')} name="columnFilter" value={this.state.columnFilter}>
              {this.props.columnHeaders.map((data, i) => (
                <option value={data.field} key={i}>
                  {data.headerName}
                </option>
              ))}
            </select>
          </div>
          <div className="table-filter-sub-section">
            <label className="table-filter-label" htmlFor="operatorFilter">
              Operator
            </label>
            <select className="table-filter-dropdown" id="operatorFilter" onChange={(e) => this.handleFilterItems(e, 'dropdown')} name="operatorFilter" value={this.state.operatorFilter}>
              {filterOperatorArray &&
                filterOperatorArray.map((data, i) => (
                  <option value={data} key={i}>
                    {data}
                  </option>
                ))}
            </select>
          </div>
          <div className="table-filter-sub-section">
            <label className="table-filter-label" htmlFor="valueFilter">
              Value
            </label>
            <input
              className="table-filter-dropdown"
              id="valueFilter"
              onChange={(e) => this.handleFilterItems(e, 'text')}
              autoComplete="off"
              type="text"
              placeholder="value.."
              name="valueFilter"
              value={this.state.valueFilter}
            />
          </div>
          <div className="table-filter-sub-section">
            <button className="table-filter-close-btn" onClick={() => this.props.handleApplyFilter(this.state.columnFilter, this.state.operatorFilter, this.state.valueFilter)}>
              <img src={tickIcon} width="25px" height="25px" />
            </button>
            <button className="table-filter-close-btn" onClick={this.handleResetFilter}>
              <img src={closeIcon} width="25px" height="25px" />
            </button>
          </div>
        </div>
        {this.props.filterError && <div style={{ color: 'red' }}>No results found for the given search criteria!</div>}
      </div>
    );
  }
}
