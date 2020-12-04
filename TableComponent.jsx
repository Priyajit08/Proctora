import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { DataService } from '../services/DataService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';

export default class TableComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            customers: null,
            loading: false,
            selectedRepresentative: null,
            selectedDate: null,
            selectedStatus: null,
            globalFilter: null
        };

        this.DataService = new DataService();
        this.representativesItemTemplate = this.representativesItemTemplate.bind(this);
        this.statusItemTemplate = this.statusItemTemplate.bind(this);
        this.nameBodyTemplate = this.nameBodyTemplate.bind(this);
        this.countryBodyTemplate = this.countryBodyTemplate.bind(this);
        this.representativeBodyTemplate = this.representativeBodyTemplate.bind(this);
        this.dateBodyTemplate = this.dateBodyTemplate.bind(this);
        this.statusBodyTemplate = this.statusBodyTemplate.bind(this);
        this.activityBodyTemplate = this.activityBodyTemplate.bind(this);
        this.onRepresentativesChange = this.onRepresentativesChange.bind(this)
        this.onDateChange = this.onDateChange.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.filterDate = this.filterDate.bind(this);
    }

    componentDidMount() {
        this.DataService.getCustomersLarge().then(data => this.setState({ customers: data }));
    }

    filterDate(value, filter) {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === this.formatDate(filter);
    }

    formatDate(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return date.getFullYear() + '-' + month + '-' + day;
    }

    onRepresentativesChange(e) {
        this.dt.filter(e.value, 'countyName', 'in');
        this.setState({ selectedRepresentative: e.value });
    }

    onDateChange(e) {
        this.dt.filter(e.value, 'date', 'custom');
        this.setState({ selectedDate: e.value });
    }

    onStatusChange(e) {
        this.dt.filter(e.value, 'state', 'equals');
        this.setState({ selectedStatus: e.value })
    }

    nameBodyTemplate(rowData) {
        return (
            <React.Fragment>
                {rowData.countyName}
            </React.Fragment>
        );
    }

    countryBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="image-text">{rowData.countyCode}</span>
            </React.Fragment>
        );
    }

    representativeBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="image-text">{rowData.state}</span>
            </React.Fragment>
        );
    }

    dateBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.date}</span>
            </React.Fragment>
        );
    }

    statusBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.confirmedCases}</span>
            </React.Fragment>
        );
    }

    activityBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span>{rowData.deaths}</span>
            </React.Fragment>
        );
    }

    representativesItemTemplate(option) {
        return (
            <div className="p-multiselect-representative-option">
                <span>{option.state}</span>
            </div>
        );
    }

    statusItemTemplate(option) {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }

    render() {
        const header = (
            <div className="table-header">
                List of Customers
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" />
                </span>
            </div>
        );

        const representativeFilter = <MultiSelect value={this.state.selectedRepresentative} options={this.countyName} itemTemplate={this.representativesItemTemplate} onChange={(e) => this.setState({ selectedRepresentative: e.value })} optionLabel="name" optionValue="name" placeholder="All" className="p-column-filter" />;
        const dateFilter = <Calendar value={this.state.selectedDate} onChange={(e) => this.setState({ selectedDate: e.value })} dateFormat="yy-mm-dd" className="p-column-filter" placeholder="Registration Date"/>;
        const statusFilter = <Dropdown value={this.state.selectedStatus} options={this.state.state} onChange={(e) => this.setState({ selectedStatus: e.value })} itemTemplate={this.statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;

        return (
            <div className="datatable-filter-demo">
                <div className="card">
                    <DataTable ref={(el) => this.dt = el} value={this.state.customers} paginator rows={10}
                        header={header} className="p-datatable-customers"
                        globalFilter={this.state.globalFilter} emptyMessage="No customers found." loading={this.state.loading}>
                        <Column field="countyName" header="County Name" body={this.nameBodyTemplate} filter filterPlaceholder="Search by County" />
                        <Column field="countyCode" header="County Code" body={this.countryBodyTemplate} filter filterPlaceholder="Search by County ID" filterMatchMode="contains" />
                        <Column field="state" header="state" body={this.representativeBodyTemplate} filter filterElement={representativeFilter} />
                        <Column field="date" header="Date" body={this.dateBodyTemplate} filter filterElement={dateFilter} filterFunction={this.filterDate} />
                        <Column field="confirmedCases" header="Status" body={this.statusBodyTemplate} filter filterElement={statusFilter}/>
                        <Column field="deaths" header="Activity" body={this.activityBodyTemplate} filter filterPlaceholder="Minimum" filterMatchMode="gte" />
                    </DataTable>
                </div>
            </div>
        );
    }
}