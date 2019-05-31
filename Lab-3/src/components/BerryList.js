import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class BerryList extends Component {
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
   async getBerry(page) {
    try {this.setState({currentPage:page});
    console.log(page);
    let response={};
    if(parseInt(page) ===0)
        response = await axios.get("https://pokeapi.co/api/v2/berry/?limit=20");      
    else{    
        response = await axios.get('https://pokeapi.co/api/v2/berry/?limit=20&offset='+parseInt(page) * 20);
        if(parseInt(page) >((response.data.count)/20)-1)throw`No page found`;
    }
            // const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
            console.log(response);
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
        this.getBerry(parseInt(newPage));
    }
    }
    componentDidMount() {

        this.getBerry(parseInt(this.props.match.params.page));

    }

      onSubmit(e) {
            e.preventDefault();
      }
  
   render() {
      let body = null;
      let li = null;
    //   let button = null;
      let nextPage = null;
      let prevPage = null;
      console.log(this.state.data);
    //   button = 
    //   this.state.data
    //   {
    //      console.log(this.state.data);
    //   } 
   
	 li =
		this.state.data &&
		this.state.data.map(berry => (
		   <li key={berry.url}>
			  <Link to={`/berries/${berry.url.split('/')[6]}`}>{berry.name}</Link>
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
           nextPage =<Button> <Link to={`/berries/page/${Math.ceil(parseInt(String(this.state.nextPage).split('=')[1].replace(/[a-zA-Z& ]/g, ""))/20)}`}>Next</Link></Button>
        } 
        else if(this.state.data && this.state.previousPage && this.state.nextPage)
        {
           nextPage = <Button><Link to={`/berries/page/${Math.ceil(parseInt(String(this.state.nextPage).split('=')[1].replace(/[a-zA-Z& ]/g, ""))/20)}`}>Next</Link></Button>
           prevPage = <Button><Link to={`/berries/page/${Math.ceil(parseInt(String(this.state.previousPage).split('=')[1].replace(/[a-zA-Z& ]/g, ""))/20)}`}>Previous</Link></Button>
           
        } 
        else if(this.state.data && this.state.nextPage == null && this.state.previousPage)
        {
           prevPage =<Button> <Link to={`/berries/page/${Math.ceil(parseInt(String(this.state.previousPage).split('=')[1].replace(/[a-zA-Z& ]/g, ""))/20)}`}>Previous</Link></Button>
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
                <ul className="list-unstyled">{li}</ul>
            </div>
            );
         }

      return body;
   }
}

export default BerryList;