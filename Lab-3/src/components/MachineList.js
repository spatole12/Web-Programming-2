import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class MachineList extends Component {
   constructor(props) {
      super(props);
      this.state = {
        data: undefined,
        loading: false,
        searchTerm: undefined,
        searchData: undefined,
        currentPage:0,
        previousPage:undefined,
        nextPage:undefined,
      };
   }
   async getMachine(page) {
        try {
            this.setState({currentPage:page});
            console.log(page);
            let response={};
            if(parseInt(page) ===0)
                response = await axios.get("https://pokeapi.co/api/v2/machine/?limit=20");      
            else{    
                response = await axios.get('https://pokeapi.co/api/v2/machine/?limit=20&offset='+parseInt(page) * 20);
                if(parseInt(page) >((response.data.count)/20)-1)throw`No page found`;
            }
                    // const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
                    console.log(response.data.results);
                    this.setState({ data: response.data.results,previousPage: response.data.previous, nextPage: response.data.next });
                    
                } catch (e) {
                    console.log(e);
                    this.setState({
                        loading: false,
                        error:`${e}`
                     });
                }
    }
    componentWillReceiveProps(nextProps) {
    const oldParams = this.props.match.params;
    const newParams = nextProps.match.params;

    const oldPage = oldParams.page;
    const newPage = newParams.page;

    if (oldPage !== newPage) {
        this.getMachine(parseInt(newPage));
    }
    }
    componentDidMount() {

        this.getMachine(parseInt(this.props.match.params.page));

    }

      onSubmit(e) {
            e.preventDefault();
      }
  
   render() {
      let body = null;
      let machine = null;
      let li = null;
      //   let button = null;
     let nextPage = null;
     let prevPage = null;
    machine = this.state.data &&
                  this.state.data.map(machine => (
                     <li className="list" key={machine.url}>
                       <Link to={`/machines/${machine.url.split('/')[6]}`}>
                       Machine with id: {machine.url.split('/')[6]}</Link>
                     </li>
                  ));

        if(this.state.data!==undefined &&Object.keys(this.state.data).length===0)
        {
            
            nextPage=null;
            prevPage=null;
        }         
        else if(this.state.data && this.state.previousPage == null && this.state.nextPage)
        {
            prevPage = null;
            console.log(String(this.state.nextPage));
            console.log();
            nextPage =<Button> <Link to={`/machines/page/${Math.ceil(parseInt(String(this.state.nextPage).split('=')[1].replace(/[a-zA-Z& ]/g, ""))/20)}`}>Next</Link></Button>
        } 
        else if(this.state.data && this.state.previousPage && this.state.nextPage)
        {
            nextPage = <Button><Link to={`/machines/page/${Math.ceil(parseInt(String(this.state.nextPage).split('=')[1].replace(/[a-zA-Z& ]/g, ""))/20)}`}>Next</Link></Button>
            prevPage = <Button><Link to={`/machines/page/${Math.ceil(parseInt(String(this.state.previousPage).split('=')[1].replace(/[a-zA-Z& ]/g, ""))/20)}`}>Previous</Link></Button>
            
        } 
        else if(this.state.data && this.state.nextPage == null && this.state.previousPage)
        {
            prevPage =<Button> <Link to={`/machines/page/${Math.ceil(parseInt(String(this.state.previousPage).split('=')[1].replace(/[a-zA-Z& ]/g, ""))/20)}`}>Previous</Link></Button>
            nextPage = null;
    
        }
        
        if (this.state.error) {
            body = (
               <div>
                  <h1>404 Not Found</h1>
               </div>
            );
         } else{
            body = (
                <div>
                    
                    {prevPage}
                    
                    {nextPage}
                    <ul className="list-unstyled">{machine}</ul>
                </div>
            );
            }
      return body;
   }
}

export default MachineList;