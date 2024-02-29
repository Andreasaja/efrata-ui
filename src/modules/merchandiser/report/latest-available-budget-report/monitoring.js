import { inject } from 'aurelia-framework'
import { Service } from "./service";

const SectionLoader = require("../../../../loader/garment-sections-loader");
const CostCalculationGarmentLoader = require('../../../../loader/cost-calculation-garment-loader');
const GarmentBuyerLoader = require("../../../../loader/garment-buyers-loader");

@inject(Service)
export class Monitoring {
    constructor(service) {
        this.service = service;
    }

    controlOptions = {
        label: { length: 5 },
        control: { length: 2 }
    }

    statusList = [
        null,
        "OK",
        "NOT OK"
    ]

    costCalculationFilter = {}

    get sectionLoader() {
        return SectionLoader;
    }
    get costCalculationGarmentLoader() {
        return CostCalculationGarmentLoader;
    }
    get garmentBuyerLoader() {
        return GarmentBuyerLoader;
    }

    tableData = []

    get filter() {
        return {
            section: (this.selectedSection || {}).Code,
            dateStart: this.selectedDateStart,
            dateEnd: this.selectedDateEnd,
        };
    }

    search() {
        this.service.search({ filter: JSON.stringify(this.filter) })
            .then(result => {
                this.tableData = result.data;
                // DATA OK LEAD TIME 30  HARI
                const total30 = this.tableData.filter(f => f.LeadTime == 30).length;
                const totalOk30 = this.tableData.filter(f => f.DateDiff >= 30 && f.LeadTime == 30).length;
                const totalNotOk30 = this.tableData.filter(f => f.DateDiff < 30 && f.LeadTime == 30).length;

                this.dataOk30 = {
                    total: totalOk30,
                    percent: (totalOk30 / total30 * 100).toFixed(2)
                };
                this.dataNotOk30 = {
                    total: totalNotOk30,
                    percent: (totalNotOk30 / total30 * 100).toFixed(2)
                };
                this.tot30 = total30;

                // DATA OK LEAD TIME 25  HARI
                // const total25 = this.tableData.filter(f => f.LeadTime == 25).length;
                // const totalOk25 = this.tableData.filter(f => f.DateDiff >= 25 && f.LeadTime == 25).length;
                // const totalNotOk25 = this.tableData.filter(f => f.DateDiff < 25 && f.LeadTime == 25).length;

                // this.dataOk25 = {
                //     total: totalOk25,
                //     percent: (totalOk25 / total25 * 100).toFixed(2)
                // };
                // this.dataNotOk25 = {
                //     total: totalNotOk25,
                //     percent: (totalNotOk25 / total25 * 100).toFixed(2)
                // };
                // this.tot25 = total25;
                // AKUMULASI DATA
                const total = total30; //+ total25;
                const totalOk =  totalOk30; // + totalOk25;
                const totalNotOk = totalNotOk30; // + totalNotOk25;
                
                this.dataOk = {
                    total: totalOk,
                    percent: (totalOk / total * 100).toFixed(2)
                };
                this.dataNotOk = {
                    total: totalNotOk,
                    percent: (totalNotOk / total * 100).toFixed(2)
                };
                this.tot = this.tot30;  //this.tot25 + 
            });
    }

    clear() {
        this.selectedSection = null;
        this.selectedDateStart = undefined;
        this.selectedDateEnd = undefined;
        this.tableData = [];
    }

    xls() {
        this.service.xls({ filter: JSON.stringify(this.filter) });
    }
}