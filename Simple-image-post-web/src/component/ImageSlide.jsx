import { useEffect, useState } from 'react';
import '../css-file/image-slide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const circleActiveColor = 'rgb(255, 255, 255, 1)' ;
const circleNonActiveColor = 'rgb(255, 255, 255, 0.3)' ;


function ImageSlide(props) {
    const [imageArr, setImageArr] = useState();
    const [arrPosition, setArrPosition] = useState();
    const [positionButtonColorDefault, setPositionButtonColorDefault] = useState();

    const [positionButtonColor, setPositionButtonColor] = useState();
    const [currentPosition, setCurrentPosition] = useState(0);
    const [buttonDis, setButtonDis] = useState('none');
    const [positionButtonDis, setPositionButtonDis] = useState();

    function clearpositionButtonColor() {
        setPositionButtonColor(positionButtonColorDefault);
    }
   
    function selectPositionImg(value) {
        let box = document.getElementById(props.id);
        box.scrollTo({left: value, behavior: 'smooth'});
    }

    useEffect(() => {
        clearpositionButtonColor();
        setPositionButtonColor(prev => {return{...prev, [currentPosition]: circleActiveColor}});
        
        // eslint-disable-next-line
    }, [currentPosition]);


    useEffect(() => {
        setImageArr(props.images);
    }, [props.images]);

    useEffect(() => {
        if(props.images) {

            let preArrPosition = [];
            let prePositionButtonColor = {};
            let prePositionButtonColorDefault = {};
            for(let i = 0 ; i < props.images.length ; i++) {
                preArrPosition.push(i)
                if(currentPosition > props.images.length - 2) {
                    prePositionButtonColor[i] = i === props.images.length-1 ? circleActiveColor : circleNonActiveColor;
                    setCurrentPosition(props.images.length-1);
                } else {
                    prePositionButtonColor[i] = i === currentPosition ? circleActiveColor : circleNonActiveColor;
                }
                prePositionButtonColorDefault[i] = '';
            }
    
            setPositionButtonColor(prePositionButtonColor);
            setArrPosition([...preArrPosition]);
            setPositionButtonColorDefault({...prePositionButtonColorDefault});
            setPositionButtonDis(() => {if(props.images.length === 1) {return 'none'}});
        }
    }, [props.images, currentPosition]); 

    if(props.images && arrPosition) {
        return (
            <div className='bigCardImageBox'  onMouseOver={() => {if(imageArr.length !== 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')}>
                <div id={props.id} className='bigCardImageSlideBox' >
                    {imageArr.map((e) => <div key={Math.random()} className='bigCardSlideImage'><img src = {e}  alt='Product' /></div>)}
                </div>

                <div className='positionBox' onMouseOver={() => {if(imageArr.length > 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')} >
                    {arrPosition.map((e) => <button key = {e} style = {{color: positionButtonColor[e], display: positionButtonDis}} onMouseOver={() => {if(imageArr.length !== 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')}
                    onClick={() => {
                        let box = document.getElementsByClassName('bigCardImageBox');
                        selectPositionImg(e *  box[0].offsetWidth);
                        setCurrentPosition(e);
                    }} ><FontAwesomeIcon icon={faCircle} /></button>)}
                </div>


                <button className='rightSlide' style={{display: buttonDis}} onMouseOver={() => {if(imageArr.length !== 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')} 
                onClick={() => {
                    if(currentPosition < arrPosition.length - 1) {
                        let box = document.getElementsByClassName('bigCardImageBox');
                        selectPositionImg((currentPosition + 1) * box[0].offsetWidth)
                        setCurrentPosition(currentPosition + 1);   
                    }
                }} ><FontAwesomeIcon icon={faChevronRight} /></button>
                
                
                <button className='leftSlide' style={{display: buttonDis}} onMouseOver={() => {if(imageArr.length !== 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')} 
                onClick={() => {
                    if(currentPosition > 0) {
                        let box = document.getElementsByClassName('bigCardImageBox');
                        selectPositionImg((currentPosition - 1) * box[0].offsetWidth);
                        setCurrentPosition(currentPosition - 1);
                    }
                }}><FontAwesomeIcon icon={faChevronLeft} /></button>
            </div>   
        );
    }    
}

export default ImageSlide