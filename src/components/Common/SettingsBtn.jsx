import { LucideSettings } from 'lucide-react';
import GlobalStyles from '../../assets/css/globleStyles.module.css';

const SettingsBtn = (props) => {
  return (
    <div className={`${GlobalStyles.floatingDiv}`} style={{ bottom: "90px" }} onClick={props?.click}>
      <button className={`${GlobalStyles.floatingBtn}`}>
        <LucideSettings style={{ position: "relative", bottom: "3px" }} />
      </button>
    </div>
  );
}

export default SettingsBtn