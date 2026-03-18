import React from "react";
import { User as UserIcon, Phone } from "lucide-react";
import Chetan from "../../../../assets/images/Chetan.jpeg";
import styles from "./EnhancedProfile.module.css";

const EnhancedProfile = ({ profile, role, isOnline }) => (
  <div className={styles.enhancedProfile}>
    <div className={styles.enhancedAvatarSection}>
      <div className={styles.enhancedAvatarBox}>
        <img src={Chetan} alt="" />
        <UserIcon size={32} color="#94a3b8" />
      </div>
      <div className={styles.enhancedProfileInfo}>
        <span className={styles.enhancedRoleTag}>{role}</span>
        <span className={styles.enhancedProfileName}>{profile.name}</span>
        <div className={styles.enhancedProfilePhone}>
          <Phone size={11} />{" "}
          <a href={`tel:${profile.phone}`} className={styles.enhancedPhoneLink}>
            {profile.phone}
          </a>
        </div>
      </div>
    </div>
    <div className={styles.enhancedRatingRow}>
      <span className={styles.ratingText}>5.0</span>
    </div>
  </div>
);

export default EnhancedProfile;
