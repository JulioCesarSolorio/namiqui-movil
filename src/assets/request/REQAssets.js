import mapIconDefaultImage from '../icons/delitos/default.png';

export default class REQAssets {
  static async setCrimeActsTypes(crimeActsTypes) {
    this.crimeActsTypes = crimeActsTypes;
  }

  static getCrimeActsTypes() {
    return (this.crimeActsTypes) ? this.crimeActsTypes : [];
  }

  static getCrimeIconMap(crime) {
    let icon = mapIconDefaultImage;
    console.log("buscando icono2");
    console.log(icon.url_img_map);
    Object.keys(this.crimeActsTypes).forEach((k) => {
      if (crime.app_crime_act_id === this.crimeActsTypes[k].id) {
        if (this.crimeActsTypes[k].url_img_map) {
          
          //console.log(this.crimeActsTypes[k].url_img_map);
          icon = { uri: this.crimeActsTypes[k].url_img_map };
        }
        return;
      }
    });
    return icon;
  }
}
