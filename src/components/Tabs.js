import {Component} from 'react';
import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import axios from 'axios';

class CustomTabs extends Component {

    constructor(props){
        super(props);

        this.state = {
            saved : '',
            loading:false,
            modal: false,
            modalConfirmation: false,
            tabs : [
                {
                    id: Math.random(),
                    name: "2022",
                    contents: [
                        {
                            id: 0,
                            invoiceSender : '',
                            date: '',
                            invoiceNumber : '',
                            invoiceAmount : 0,
                            person : '',
                            lbv_paid : 0,
                            pkv_paid : 0,
                            paid: false,
                        },
                        
                    ]
                },
            ],
            newTabName : '',
            activeTab: 0,
        }
    }

    componentDidMount(){
        const url = `${appLocalizer.apiUrl}/sujan/v1/tables?user_id=${appLocalizer.user_id}`;

        this.setState({
            'user_id' : `${appLocalizer.user_id}`
        });
    
        axios.get(url).then((res)=>{
          this.setState({
            tabs: JSON.parse( res.data[0].tabs ),
            activeTab: res.data[0].tab_last_opened
          });
        });
      }


    render(){

        const setModal = () => {
            this.setState({
                modal: true
            })
        }

        const closeModal = () => {
            this.setState({
                modal: false
            });
        }

        const addNewTab = (e) => {

            const info = {
                id: Math.random(),
                name : this.state.newTabName.trim(),
                contents : [
                    {
                        id: Math.random(),
                        invoiceSender : '',
                        date: '',
                        invoiceNumber : '',
                        invoiceAmount : 0,
                        person : '',
                        lbv_paid : 0,
                        pkv_paid : 0,
                        paid: false
                    },
                ]
            };

            if( this.state.newTabName.trim() != '' ){
                this.setState({
                    tabs : [
                        ...this.state.tabs,
                        info
                    ],
                    newTabName : '',
                    modal: false
                });
            }



            
        };


        const removeTab = (index) => {
            const prevTab = this.state.tabs;
            prevTab.splice(index, 1);

            this.setState({
                tabs : prevTab
            });
        }


        const newTab = (e) => {
            this.setState({
                newTabName : e.target.value
            });
        }

        const switchTab = (index) => {
            this.setState({
                activeTab: index
            });
        }

        const addNewItem  = (firstIndex) => {
            let tabs = this.state.tabs;

            tabs[firstIndex].contents = [
            ...tabs[firstIndex].contents,
            {
                invoiceSender : '',
                date: '',
                invoiceNumber : '',
                invoiceAmount : 0,
                person : '',
                person_lbv : 0,
                person_pkv : 0,
                lbv_paid : 0,
                pkv_paid : 0,
                paid: false
            }];

            this.setState({
                tabs : tabs
            });
        }

        const removeItem = (firstIndex, secondIndex) => {

            const tabs = this.state.tabs;

            tabs[firstIndex].contents.splice(secondIndex, 1);

            this.setState({
                tabs : tabs
            });
        }

        const contentChangeHandler = (e) => {
            let items = [...this.state.tabs];
            let item = {...items[e.target.dataset.first]["contents"][e.target.dataset.second]};
            item[e.target.name] = e.target.value;

            items[e.target.dataset.first]["contents"][e.target.dataset.second] = item;

            this.setState({items}); 
        };

        const checkboxChangeHandler = (e) => {
            let items = [...this.state.tabs];
            let item = {...items[e.target.dataset.first]["contents"][e.target.dataset.second]};
            item[e.target.name] = !this.state.tabs[e.target.dataset.first]['contents'][e.target.dataset.second].paid;

            items[e.target.dataset.first]["contents"][e.target.dataset.second] = item;

            this.setState({items}); 
        };

        const personsChangeHandler = (e) => {
            let items = [...this.state.tabs];
            let item = {...items[e.target.dataset.first]["contents"][e.target.dataset.second]};
            item[e.target.name] = e.target.value;

            // console.log(this.props.persons.find((person)=>person.id==e.target.value));

            
            item['person_role'] = this.props.persons.find(x => x.id == e.target.value).role;
            item['person_name'] = this.props.persons.find(x => x.id == e.target.value).name;
            item['person_lbv'] = this.props.persons.find(x => x.id == e.target.value).lbv;
            item['person_pkv'] = this.props.persons.find(x => x.id == e.target.value).pkv;
            


            items[e.target.dataset.first]["contents"][e.target.dataset.second] = item;

            this.setState({items}); 
        };

        const saveDataTables = () => {
            const url = `${appLocalizer.apiUrl}/sujan/v1/tables`;

            this.setState({
                loading: true
            });
            axios.post( url, {
                'user_id' : parseFloat(this.state.user_id),
                'persons' : JSON.stringify(this.props.persons),
                'tabs'     : JSON.stringify(this.state.tabs),
                'tab_last_opened' : this.state.activeTab
            }, {
                headers: {
                    'content-type': 'application/json',
                    'X-WP-NONCE': appLocalizer.nonce
                }
            } )
            .then( ( res ) => {
                res.data == 'unauthorized' ? 
                    this.setState({
                        loading: false,
                        saved: 'You have to login first to save your data'
                    })
                     : 
                     this.setState({
                        loading: false,
                        saved: 'The information has been saved!'
                    })
                    
            } )
        }

        const defaultOption = <option key={Math.random()} value={Math.random()}>Select person</option>

        const setConfirmationModal = () => {
            this.setState({
                modalConfirmation: true
            })
        }

        const closeConfirmationModal = () => {
            this.setState({
                modalConfirmation: false
            });
        }


        return (
            
        

        <div className="custom-tabs">
          <h2>Tabs</h2>
  
          <p>{this.state.saved}</p>
          <div className="tab">
            {this.state.tabs.map((tab, index) => (
                <button key={tab.id} onClick={()=>switchTab(index)} className={'tablinks ' + (index == this.state.activeTab ? 'active' : '') }>{tab.name}</button>
            ))}
            
            
            <button onClick={setModal} className="tablinks" style={{border: '1px solid gray', color:'white', background:'blue'}} ><strong>+ Add Tab</strong></button>

            <PureModal
                header="Add new Tab"
                footer={
                    <div>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={addNewTab}>Add Tab</button>
                    </div>
                }
                isOpen={this.state.modal}
                closeButtonPosition="bottom"
                onClose={closeModal} 
                width="500px"
            >
                <input value={this.state.newTabName} onChange={newTab} type="text" placeholder="Type tab name" required />
            </PureModal>
            
            <button onClick={saveDataTables} className="tablinks" style={{border: '1px solid gray', color:'white', background:'green'}}><strong>
            {this.state.loading == true ? (
                <span>Loading...</span>
                ) : (
                <span>Save</span>
                )
            }
            </strong></button>
  
            </div>
            
            {this.state.tabs.map((tab, firstIndex) => (
            <div key={tab.id} id={firstIndex} className={"tabcontent " + (firstIndex == this.state.activeTab ? 'tab-active' : '')}>
  
              <button onClick={setConfirmationModal} className="cbtn" type="button" style={{float: 'left', color:'red'}} >Delete Tab {tab.name}</button><br /><br />
              <PureModal
                header={"Delete Tab " + tab.name}
                footer={
                    <div>
                    <button onClick={closeConfirmationModal}>Cancel</button>
                    <button onClick={()=>removeTab(firstIndex)}>Confirm</button>
                    </div>
                }
                isOpen={this.state.modalConfirmation}
                closeButtonPosition="bottom"
                onClose={closeConfirmationModal} 
                width="500px"
              >
                Are you sure you want to remove the tab?
              </PureModal>
              
              <h3>{tab.name}</h3>
              <div className="">
                <h2>Tables</h2>
                <div style={{overflowX:'scroll'}}>
                    <table className="ltable" id="ytable" style={{width: '100%'}}>
                      <thead>
                        <tr className="">
                          <th>Invoice Sender</th>
                          <th>Date</th>
                          <th>Invoice Number</th>
                          <th>Invoice Amount</th>
                          <th>Persons</th>
                          <th>% LBV</th>
                          <th>% PKV</th>
                          <th>LBV have normally to pay</th>
                          <th>PKV have normally to pay</th>
                          <th>LBV actually paid back</th>
                          <th>PKV actually paid back</th>
                          <th>Own contribution LBV</th>
                          <th>Own contribution PKV</th>
                          <th>Paid</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tab.contents.map((content, secondIndex) => (
                        <tr key={secondIndex} className={content.paid == true ? 'green' : ''}>
                            <td>
                              <input data-first={firstIndex} data-second={secondIndex} onChange={contentChangeHandler} type="text" value={this.state.tabs[firstIndex]["contents"][secondIndex].invoiceSender} name="invoiceSender" size="15"  placeholder="" id="sender" /></td>
                            <td>
                              <input data-first={firstIndex} data-second={secondIndex}  onChange={contentChangeHandler} type="date" value={this.state.tabs[firstIndex]["contents"][secondIndex].date} name="date" placeholder="dd-mm-yyyy"  id="date" /></td>
                            <td>
                              <input data-first={firstIndex} data-second={secondIndex}  onChange={contentChangeHandler} type="text" value={this.state.tabs[firstIndex]["contents"][secondIndex].invoiceNumber} name="invoiceNumber" placeholder="" id="invoice_no" /></td>
                            <td>
                              <input data-first={firstIndex} data-second={secondIndex}  onChange={contentChangeHandler} type="text" value={this.state.tabs[firstIndex]["contents"][secondIndex].invoiceAmount} name="invoiceAmount" pattern="^[0-9,]*$" size="10" id="amount_0" placeholder="" min="0" /></td>
                            <td>
                              <select value={this.state.tabs[firstIndex]['contents'][secondIndex].person} data-first={firstIndex} data-second={secondIndex}  onChange={personsChangeHandler} name="person" className="stringval" id="hd5_0">
                                    
                                {defaultOption}
                                    
                                {this.props.persons.map((person)=>(
                                    
                                    <option key={person.id} value={person.id}>{person.name}</option>
                                ))}

                              </select>
                            </td>
                            <td id="lbvp_0">{this.state.tabs[firstIndex]["contents"][secondIndex].person_lbv}</td>
                            <td id="dbvp_0">{this.state.tabs[firstIndex]["contents"][secondIndex].person_pkv}</td> 

                            <td id="lbv_0">
                            {

                            // isNaN( ( (this.state.tabs[firstIndex]['contents'][secondIndex]['person_lbv'] / 100) * parseFloat( this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount'] ) )) ? '0,00' : ((this.state.tabs[firstIndex]['contents'][secondIndex]['person_lbv'] / 100) * this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount']).toFixed(2).replace('.', ',')
                            isNaN( ( (this.state.tabs[firstIndex]['contents'][secondIndex]['person_lbv'] / 100) * parseFloat( this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount'] ) )) ? '0,00' : ( (this.state.tabs[firstIndex]['contents'][secondIndex]['person_lbv'] / 100) * parseFloat( (this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount']).toString().replace(',', '.') ) ).toFixed(2).replace('.', ',')
                            
                            }</td>

                            <td id="dbv_0">
                            {

                            isNaN( ( (this.state.tabs[firstIndex]['contents'][secondIndex]['person_pkv'] / 100) * parseFloat( this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount'] ) )) ? '0,00' : ((this.state.tabs[firstIndex]['contents'][secondIndex]['person_pkv'] / 100) * parseFloat( (this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount']).toString().replace(',', '.') ) ).toFixed(2).replace('.', ',')
                            
                            }</td> 

                            <td><input data-first={firstIndex} data-second={secondIndex}  onChange={contentChangeHandler} type="text" value={this.state.tabs[firstIndex]["contents"][secondIndex].lbv_paid} name="lbv_paid" size="8" placeholder="" min="0" /></td>

                            <td>
                              <input data-first={firstIndex} data-second={secondIndex}  onChange={contentChangeHandler} type="text" value={this.state.tabs[firstIndex]["contents"][secondIndex].pkv_paid} name="pkv_paid" size="8" id="dbv1_0" placeholder="" min="0" />
                            </td>
                            
                            <td id="lbv2_0">
                                {
                                
                                isNaN( (( this.state.tabs[firstIndex]['contents'][secondIndex]['person_lbv'] / 100 ) * parseFloat( this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount'] ) - parseFloat( (this.state.tabs[firstIndex]['contents'][secondIndex]['lbv_paid']).toString().replace(',', '.') ) )) ? '0,00' : ((this.state.tabs[firstIndex]['contents'][secondIndex]['person_lbv'] / 100) * parseFloat( (this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount']).toString().replace(',', '.') ) - parseFloat( (this.state.tabs[firstIndex]['contents'][secondIndex]['lbv_paid']).toString().replace(',', '.') ) ).toFixed(2).replace('.', ',')
                                
                                // isNaN( ( (this.state.tabs[firstIndex]['contents'][secondIndex]['person_lbv'] / 100) * parseFloat( this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount'] ) )) ? '0,00' : ( (this.state.tabs[firstIndex]['contents'][secondIndex]['person_lbv'] / 100) * parseFloat( (this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount']).replace(',', '.') ) ).toFixed(2).replace('.', ',')
                                
                                }
                            </td>

                            <td id="dbv2_0">
                                {
                                isNaN( (( this.state.tabs[firstIndex]['contents'][secondIndex]['person_pkv'] / 100 ) * parseFloat( this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount'] ) - parseFloat( (this.state.tabs[firstIndex]['contents'][secondIndex]['pkv_paid']).toString().replace(',', '.') ) )) ? '0,00' : ((this.state.tabs[firstIndex]['contents'][secondIndex]['person_pkv'] / 100) * parseFloat( (this.state.tabs[firstIndex]['contents'][secondIndex]['invoiceAmount']).toString().replace(',', '.') ) - parseFloat( (this.state.tabs[firstIndex]['contents'][secondIndex]['pkv_paid']).toString().replace(',', '.') ) ).toFixed(2).replace('.', ',')
                                }
                            </td>

                            <td><input data-first={firstIndex} data-second={secondIndex}  onChange={checkboxChangeHandler} type="checkbox" defaultChecked={this.state.tabs[firstIndex]["contents"][secondIndex].paid} name="paid" style={{width:'25px',height: '25px'}} value="true" /></td>

                            <td><span onClick={()=>removeItem(firstIndex, secondIndex)} className="del" type="button"> &#10060;</span></td>
                        </tr>
                        ))}

                      </tbody>
                        
                        <tfoot>
                          
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><b>Total: </b> 
                            <span id="tamount">
                            {
                                (tab.contents.reduce(function(a,v) {
                                    if(v.invoiceAmount.length == 0){
                                        conntinue;
                                    }
                                    a += parseFloat( (v.invoiceAmount).toString().replace(',', '.') )
                                    return a;
                                },0)).toFixed(2).replace('.', ',')
                            }
                            </span> </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><b>Total: </b><span id="tlbv">
                            {
                                isNaN((tab.contents.reduce(function(a,v) {
                                    a = a + ((parseFloat(v.person_lbv) / 100)* parseFloat( (v.invoiceAmount).toString().replace(',', '.') ));
                                    return a;
                                },0))) ? '0,00' : (tab.contents.reduce(function(a,v) {
                                    a = a + ((parseFloat(v.person_lbv) / 100)* parseFloat( (v.invoiceAmount).toString().replace(',', '.') ));
                                    return a;
                                },0)).toFixed(2).replace(".", ',')
                            }
                                 </span></td>
                            <td><b>Total: </b><span id="tdbv">
                            {
                                isNaN((tab.contents.reduce(function(a,v) {
                                    a = a + ((parseFloat(v.person_pkv) / 100)* parseFloat( (v.invoiceAmount).toString().replace(',', '.') ));
                                    return a;
                                },0))) ? '0,00' : (tab.contents.reduce(function(a,v) {
                                    a = a + ((parseFloat(v.person_pkv) / 100)* parseFloat( (v.invoiceAmount).toString().replace(',', '.') ));
                                    return a;
                                },0)).toFixed(2).replace(".", ',')
                            }
                                </span></td>
                            <td><b>Total: </b><span id="tlbv1">{(tab.contents.reduce((a,v) =>  a = a + parseFloat( (v.lbv_paid).toString().replace(',', '.') ) , 0 )).toFixed(2).replace('.', ',')}</span></td>
                            <td><b>Total: </b><span id="tdbv1">{(tab.contents.reduce((a,v) =>  a = a + parseFloat( (v.pkv_paid).toString().replace(',', '.') ) , 0 )).toFixed(2).replace('.', ',')}</span></td>
                            <td><b>Total: </b><span id="tlbv2">
                            {
                                isNaN((tab.contents.reduce(function(a,v) {
                                    a = a + ( ((parseFloat(v.person_lbv) / 100)* parseFloat( (v.invoiceAmount).toString().replace(',', '.') )) - parseFloat( (v.lbv_paid).toString().replace(',', '.') ) );
                                    return a;
                                },0))) ? '0,00' : (tab.contents.reduce(function(a,v) {
                                    a = a + ( ((parseFloat(v.person_lbv) / 100)* parseFloat( (v.invoiceAmount).toString().replace(',', '.') )) - parseFloat( (v.lbv_paid).toString().replace(',', '.') ) );
                                    return a;
                                },0)).toFixed(2).replace(".", ',')
                            }

                                </span></td>
                            <td><b>Total: </b><span id="tdbv2">
                            {
                                isNaN( (tab.contents.reduce(function(a,v) {
                                    a = a + ( ((parseFloat(v.person_pkv) / 100)* parseFloat( (v.invoiceAmount).toString().replace(',', '.') )) - parseFloat( (v.pkv_paid).toString().replace(',', '.') ) );
                                    return a;
                                },0)) ) ? '0,00' : (tab.contents.reduce(function(a,v) {
                                    a = a + ( ((parseFloat(v.person_pkv) / 100)* parseFloat( (v.invoiceAmount).toString().replace(',', '.') )) - parseFloat( (v.pkv_paid).toString().replace(',', '.') ) );
                                    return a;
                                },0)).toFixed(2).replace('.', ',')
                            }
                                </span></td>
                            <td></td>
                            <td></td>
                        </tr> 
                    </tfoot>
                    </table> 
                    <br />
                    <button onClick={()=>addNewItem(firstIndex)} className="cbtn" type="button" style={{float: 'right'}} >Add New List</button>
                    </div><br />
  
                </div>

            </div>
            ))}

        </div>
        )
    }
}

export default CustomTabs;