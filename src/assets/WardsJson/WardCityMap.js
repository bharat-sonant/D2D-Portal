import Ajmer from "./Ajmer.json";
import Bharatpur from "./Bharatpur.json";
import BioficsSurat from "./Biofics-surat.json";
import Bundi from "./Bundi.json";
import Chennai from "./Chennai.json";
import Chirawa from "./Chirawa.json";
import Dausa from "./Dausa.json";
import Dehradun from "./Dehradun.json";
import DeiBundi from "./Dei-bundi.json";
import DevTest from "./DevTest.json";
import Ecogram from "./Ecogram.json";
import Etmadpur from "./Etmadpur.json";
import Hisar from "./Hisar.json";
import IITKharagpur from "./IIT-Kharagpur.json";
import IITRoorkee from "./IIT-Roorkee.json";
import JaipurBWG from "./Jaipur-BWG.json";
import JaipurCivilLines from "./Jaipur-Civil-Lines.json";
import JaipurGreater from "./Jaipur-Greater.json";
import JaipurKishanpole from "./Jaipur-Kishanpole.json";
import JaipurMurlipura from "./Jaipur-Murlipura.json";
import JaipurTest from "./Jaipur-Test.json";
import JaipurTextileRecycling from "./Jaipur-Textile-Recycling-Facility.json";
import JaipurMalviyanagar from "./Jaipur-malviyanagar.json";
import Jaipur from "./Jaipur.json";
import JammuSurvey from "./Jammu-Survey.json";
import Jaunpur from "./Jaunpur.json";
import JhodpurBWG from "./Jhodpur-BWG.json";
import Jhunjhunu from "./Jhunjhunu.json";
import Jodhpur from "./Jodhpur.json";
import Khairabad from "./Khairabad.json";
import Khandela from "./Khandela.json";
import Kishangarh from "./Kishangarh.json";
import Kuchaman from "./Kuchaman.json";
import Losal from "./Losal.json";
import MapusaGoa from "./Mapusa-Goa.json";
import Nainwa from "./Nainwa.json";
import Noida from "./Noida.json";
import Nokha from "./Nokha.json";
import Pali from "./Pali.json";
import Rajsamand from "./Rajsamand.json";
import Ratangarh from "./Ratangarh.json";
import Salasar from "./Salasar.json";
import SambharLake from "./Sambhar-Lake.json";
import Sanchore from "./Sanchore.json";
import SikarSurvey from "./Sikar-Survey.json";
import Sikar from "./Sikar.json";
import Sonipat from "./Sonipat.json";
import Sujalpur from "./Sujalpur.json";
import Sujangarh from "./Sujangarh.json";
import Sultanpur from "./Sultanpur.json";
import TonkRaj from "./Tonk-Raj.json";
import Tonk from "./Tonk.json";
import Uniara from "./Uniara.json";
import WeVOISOthers from "./WeVOIS-Others.json";
import Parbatsar from "./Parbatsar.json";
import Reengus from "./Reengus.json";
import Phalodi from "./Phalodi.json";
import Vidisha from "./Vidisha.json";

/**
 * City key (lowercase) → raw ward JSON array
 * Key matches the city/cityName param from the URL (case-insensitive).
 */
const WardCityMap = {
    "ajmer": Ajmer,
    "bharatpur": Bharatpur,
    "biofics-surat": BioficsSurat,
    "bundi": Bundi,
    "chennai": Chennai,
    "chirawa": Chirawa,
    "dausa": Dausa,
    "dehradun": Dehradun,
    "dei-bundi": DeiBundi,
    "devtest": DevTest,
    "ecogram": Ecogram,
    "etmadpur": Etmadpur,
    "hisar": Hisar,
    "iit-kharagpur": IITKharagpur,
    "iit-roorkee": IITRoorkee,
    "jaipur-bwg": JaipurBWG,
    "jaipur-civil-lines": JaipurCivilLines,
    "jaipur-greater": JaipurGreater,
    "jaipur-kishanpole": JaipurKishanpole,
    "jaipur-murlipura": JaipurMurlipura,
    "jaipur-test": JaipurTest,
    "jaipur-textile-recycling-facility": JaipurTextileRecycling,
    "jaipur-malviyanagar": JaipurMalviyanagar,
    "jaipur": Jaipur,
    "jammu-survey": JammuSurvey,
    "jaunpur": Jaunpur,
    "jhodpur-bwg": JhodpurBWG,
    "jhunjhunu": Jhunjhunu,
    "jodhpur": Jodhpur,
    "khairabad": Khairabad,
    "khandela": Khandela,
    "kishangarh": Kishangarh,
    "kuchaman": Kuchaman,
    "losal": Losal,
    "mapusa-goa": MapusaGoa,
    "nainwa": Nainwa,
    "noida": Noida,
    "nokha": Nokha,
    "pali": Pali,
    "rajsamand": Rajsamand,
    "ratangarh": Ratangarh,
    "salasar": Salasar,
    "sambhar-lake": SambharLake,
    "sanchore": Sanchore,
    "sikar-survey": SikarSurvey,
    "sikar": Sikar,
    "sonipat": Sonipat,
    "sujalpur": Sujalpur,
    "sujangarh": Sujangarh,
    "sultanpur": Sultanpur,
    "tonk-raj": TonkRaj,
    "tonk": Tonk,
    "uniara": Uniara,
    "wevois-others": WeVOISOthers,
    "parbatsar": Parbatsar,
    "reengus": Reengus,
    "phalodi": Phalodi,
    "vidisha": Vidisha,
};

export default WardCityMap;
