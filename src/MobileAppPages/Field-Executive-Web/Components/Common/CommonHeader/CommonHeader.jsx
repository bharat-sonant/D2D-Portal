import React, { useState } from 'react';
import styles from './CommonHeader.module.css';

const CommonHeader = ({
  title = '',
  showBack = false,
  onBack,
  showMenu = false,
  menuItems = [],
  gradient = ['#286c1b', '#3fb943'],

  /* NEW */
  headerStyle = {},
  titleStyle = {},
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`${styles.header} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        ...headerStyle,
      }}
    >
      {/* Left */}
      <div className={styles.left}>
        {showBack && (
          <button className={styles.iconBtn} onClick={onBack}>
            ←
          </button>
        )}
      </div>

      {/* Center */}
      <div className={styles.center}>
        <h1 className={styles.title} style={titleStyle}>
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className={styles.right}>
        {showMenu && (
          <div className={styles.menuWrapper}>
            <button
              className={styles.iconBtn}
              onClick={() => setOpen(!open)}
            >
              ⋮
            </button>

            {open && (
              <div className={styles.menu}>
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className={styles.menuItem}
                    onClick={() => {
                      setOpen(false);
                      item.onClick && item.onClick();
                    }}
                  >
                    {item.icon && (
                      <span className={styles.menuIcon}>{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default CommonHeader;
