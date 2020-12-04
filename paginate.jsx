import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DataService } from '../services/DataService';
import { InputText } from 'primereact/inputtext';

export default class TableComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            first: 0,
            totalRecords: 0,
            customers: null,
            selectedRepresentative: null,
            selectedDate: null,
            selectedStatus: null,
            globalFilter: null
        };

        this.DataService = new DataService();
        this.onPage = this.onPage.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });

        setTimeout(() => {
            this.DataService.getCustomersLarge().then(data => {
                this.datasource = data;
                this.setState({
                    totalRecords: data.length,
                    customers: this.datasource.slice(0, 10),
                    loading: false
                });
            });
        }, 500);
    }

    onPage(event) {
        this.setState({ loading: true });
        console.log("Data table state", this.state)
        //imitate delay of a backend call
        setTimeout(() => {
            const { first, rows } = event;

            this.setState({
                first,
                customers: this.datasource.slice(first, first + rows),
                loading: false
            });
        }, 500);
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

        return (
            <div>
                <div className="card">
                    <DataTable value={this.state.customers} paginator rows={10} totalRecords={this.state.totalRecords}
                        lazy first={this.state.first} onPage={this.onPage} header={header} className="p-datatable-customers"
                        globalFilter={this.state.globalFilter} emptyMessage="No customers found." loading={this.state.loading}>
                        
                        <Column field="countyName" header="County Name" sortable={true}></Column>
                        <Column field="countyCode" header="County Code" sortable={true}></Column>
                        <Column field="state" header="State" sortable={true}></Column>
                        <Column field="stateCode" header="State Code" sortable={true}></Column>
                        <Column field="date" header="Date" sortable={true}></Column>
                        <Column field="confirmedCases" header="Representative" sortable={true}></Column>
                        <Column field="deaths" header="Deaths" sortable={true}></Column>
                    </DataTable>
                </div>
            </div>
        );
    }
}
