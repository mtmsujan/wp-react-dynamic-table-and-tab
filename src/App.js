import {Component} from 'react';
import CustomTabs from './components/Tabs';
import './style.css';
import './modal.css';
import axios from 'axios';




class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      persons : [],
      policyHolderName : '',
      policyHolderLbv : '',
      policyHolderPkv : '',

      childrenName : '',
      childrenLbv : '',
      childrenPkv : '',
      
    };

  }

  componentDidMount(){
    const url = `${appLocalizer.apiUrl}/sujan/v1/tables?user_id=${appLocalizer.user_id}`;

    axios.get(url).then((res)=>{
      this.setState({
        persons: JSON.parse( res.data[0].persons )
      });
    });
  }

  render(){

    const changeHandler = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      });
    }

    const policySubmitHandler = (e) => {
      e.preventDefault();

      const values = {
        id: Math.random(),
        role : 'Policyholder',
        name : this.state.policyHolderName,
        lbv : this.state.policyHolderLbv,
        pkv : this.state.policyHolderPkv,
      };

      this.setState({
        'persons' : [...this.state.persons, values]
      });
    }

    const childrenSubmitHandler = (e) => {
      e.preventDefault();

      const values = {
        id: Math.random(),
        role : 'Children',
        name : this.state.childrenName,
        lbv : this.state.childrenLbv,
        pkv : this.state.childrenPkv,
      };

      this.setState({
        'persons' : [...this.state.persons, values]
      });
    }

    const removePerson = (index) => {
      const prev = this.state.persons;
      prev.splice(index, 1);

      this.setState({
        persons: prev
      });
    }

    const defaultTr = this.state.persons.length == 0 && (
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><span className="del"> ❌</span></td>
      </tr>
    );

    return (
      <div className='app'>
        <div className="row">
          <div className="col1">
              <h1>Headline</h1>
              <div className="box">
                <h3>Policyholder</h3>
  
                <form onSubmit={policySubmitHandler}> 
                  <table>
                    <thead>
                      <tr>
                        <th>First and Surname</th>
                        <th>% LBV</th>
                        <th>% PKV</th>
                        <th>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input name="policyHolderName" onChange={changeHandler} type="text" size="15" placeholder="" id="string1" required />
                        </td>
                        <td>
                          <input name="policyHolderLbv" onChange={changeHandler} type="number" className="w-80" placeholder="" min="0" max="100" required />
                        </td>
                        <td>
                          <input name="policyHolderPkv" onChange={changeHandler} type="number"  className="w-80" placeholder="" min="0" max="100" id="int1_1" required />
                        </td>
                        <td>
                          <button type="submit" className="cbtn">Add</button>
                        </td>
                      </tr>
                    </tbody>
                    
                  </table>
                      
                </form>
              </div>
              <div className="box">
                <h3>Children</h3>
                <form onSubmit={childrenSubmitHandler}> 
                  <table>
                  <thead>
                      <tr>
                        <th>First and Surname</th>
                        <th>% LBV</th>
                        <th>% PKV</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input name="childrenName" onChange={changeHandler} type="text" size="15" placeholder="" id="string1" required />
                        </td>
                        <td>
                          <input name="childrenLbv" onChange={changeHandler} type="number" className="w-80" placeholder="" min="0" max="100" required />
                        </td>
                        <td>
                          <input name="childrenPkv" onChange={changeHandler} type="number"  className="w-80" placeholder="" min="0" id="int1_1" required />
                        </td>
                        <td>
                          <button type="submit" className="cbtn">Add</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                      
                </form>
              </div>
          </div>
          <div className="col2">
              <h2 style={{display: 'inline-block'}}>Added Persons</h2> 
              <table className="btable"id='table1' >
                <thead>
                  <tr className="bg-blue">
                    <th>Role</th>
                    <th>First and Surname</th>
                    <th>Value of LBV in %</th>
                    <th>Value of PKV in %</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultTr}
                  {this.state.persons.map((person, index) => (
                    <tr key={index}>
                      <td>{person.role}</td>
                      <td>{person.name}</td>
                      <td>{person.lbv}</td>
                      <td>{person.pkv}</td>
                      <td><span onClick={()=>removePerson(index)} className="del"> &#10060;</span></td>
                    </tr>
                  ))}
                  
                </tbody>          
              </table>        
          </div>
        </div>
  
        <CustomTabs persons={this.state.persons} />
      </div>
  
    );
  }
  
  
}

export default App;
