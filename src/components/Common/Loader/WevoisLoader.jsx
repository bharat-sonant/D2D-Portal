import { ReactComponent as IconLogo } from "../../../assets/images/icons/logoGreen.svg";
import loaderStyle from './loaderStyle.module.css';

const WevoisLoader = ({title,height}) => {
  return (
    <div className={loaderStyle.loadercontainer} style={{height:height||''}}>
      <div className={loaderStyle.loader}>
        <div className={loaderStyle.rotatingBorder}></div>
        <div className={loaderStyle.fixedContent}>
          <IconLogo className={loaderStyle.logo} />
        </div>
      </div>
      <p>{title || 'Loading data, Please wait...'}</p>
    </div>
  );
}

export default WevoisLoader