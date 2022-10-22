import React,{Component} from 'react';
import './index.css';
export default class SearchBox extends Component{
    constructor(props){
        super(props);
        this.state = {value:props.value || ''}
    }
    onChange(value){
        clearTimeout(this.timeout);
        this.setState({value})
        this.timeout = setTimeout(()=>{
            let {onChange} = this.props;
            onChange(value)
        },700)
    }
    render(){
        let {onChange} = this.props;
        let {value} = this.state;
        return (
            <input className='search-box' placeholder='جستجو' type='text' value={value} onChange={(e)=>this.onChange(e.target.value)}/>
        )
    }
}