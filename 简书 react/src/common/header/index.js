import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { actionCreator } from './store';
import { Link } from 'react-router-dom';
import { actionCreators as loginActionCreator } from '../../pages/login/store';
import { 
	HeaderWrapper,
	Logo,
	Nav,
	NavItem,
	NavSearch,
	Addition,
	Button,
	SearchInfo,
	SearchInfoTitle,
	SearchInfoSwitch,
	SearchInfoItem,
	SearchInfoList,
	SearchWrapper
} from './style';

class Header extends Component{
	
	getListArea=()=>{
		const { focused,list,mouseIn,page,totalPage,handleMouseEnter,handleChangePage,handleMouseLeave }=this.props;
		const newList=list.toJS();
		const pageList=[];
		
		if(newList.length){
			for(let i=(page-1)*10;i<page*10;i++){
			pageList.push(
				<SearchInfoItem key={newList[i]}>{newList[i]}</SearchInfoItem>
			)
	       }
		}
		
		
		if(focused||mouseIn){
			return(
				<SearchInfo 
				  onMouseEnter={handleMouseEnter}
				  onMouseLeave={handleMouseLeave}>
					<SearchInfoTitle>
					   热门搜索
					   <SearchInfoSwitch onClick={()=>handleChangePage(page,totalPage,this.spinIcon)}>
				<i ref={(icon)=>{this.spinIcon=icon}} className="iconfont spin">
</i>
						  换一批
					   </SearchInfoSwitch>
					</SearchInfoTitle>
					<SearchInfoList>
					{
						pageList
		            }
						
					</SearchInfoList>
				</SearchInfo>
			)
		}else{
			return null;
		}
	}
	
	render(){
		const { focused,handleInputFocus,handleInputBlur,list,login,logout }=this.props;
		return (
			<HeaderWrapper>
			        <Link to='/'>
						<Logo/>
			        </Link>
					<Nav>
						<NavItem className='left active'>首页</NavItem>
						<NavItem className='left'>下载App</NavItem>
						<NavItem className='right'>
			{
			login ? 
			<NavItem onClick={logout} className='right'>退出</NavItem> : <Link to='/login'><NavItem className='right'> 登录</NavItem></Link>
			}
			            </NavItem>
						<NavItem className='right'>
							<i className="iconfont">  </i>
						</NavItem>
						<SearchWrapper>
						  <CSSTransition
							in={focused}
							timeout={200}
							classNames="slide"
						  >
								<NavSearch
								   className={focused ? 'focused':''}
								   onFocus={()=>handleInputFocus(list)}
								   onBlur={handleInputBlur}
								></NavSearch>
						  </CSSTransition>
							<i className={focused ? 'focused iconfont zoom':'iconfont zoom'}>  </i>
							{this.getListArea()}
						</SearchWrapper>
					</Nav>
					<Addition>
					    <Link to='/write'>
						<Button className='writting'>
							<i className="iconfont">  </i>
							 写文章
						</Button>
					    </Link>
						<Button className='reg'>注册</Button>
					</Addition>
			 </HeaderWrapper>
	  )
	}
}


const mapStateToProps=(state)=>{
	return{
		focused: state.getIn(['header','focused']),
		list: state.getIn(['header','list']),
		page: state.getIn(['header','page']),
		mouseIn: state.getIn(['header','mouseIn']),
		totalPage: state.getIn(['header','totalPage']),
		login: state.getIn(['login','login'])
	}
}

const mapDispathToProps=(dispatch)=>{
	return{
		handleInputFocus(list){
			if(list.size===0){
				dispatch(actionCreator.getList());
			}		
			dispatch(actionCreator.searchFocus());
		},
		handleInputBlur(){
			dispatch(actionCreator.searchBlur());
		},
		handleMouseEnter(){
		    dispatch(actionCreator.mouseEnter());
	    },
		handleMouseLeave(){
			dispatch(actionCreator.mouseLeave());
		},
		handleChangePage(page,totalPage,spin){
			let originAngle=spin.style.transform.replace(/[^0-9]/ig,'');
			if(originAngle){
				originAngle=parseInt(originAngle,10)
			}else{
				originAngle=0;
			}
			spin.style.transform='rotate('+(originAngle+360)+'deg)';
			if(page<totalPage){
				dispatch(actionCreator.changePage(page+1));
			}else{
				dispatch(actionCreator.changePage(1));
			}			
		},
		logout(){
			dispatch(loginActionCreator.logout());
		}
	}
}

export default connect(mapStateToProps,mapDispathToProps)(Header);