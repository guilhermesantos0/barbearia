import * as Collapsible from "@radix-ui/react-collapsible";
import { HamburgerMenuIcon, Cross2Icon, DashboardIcon } from "@radix-ui/react-icons";
import styles from "./Test.module.scss";
import { useState } from "react";

export const TestSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Collapsible.Root
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className={`${styles.sidebar} ${isExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed}`}
    >
      <Collapsible.Trigger asChild>
        <button className={styles.toggleButton}>
          {isExpanded ? <Cross2Icon /> : <HamburgerMenuIcon />}
        </button>
      </Collapsible.Trigger>

      <nav>
        <ul className={styles.navList}>
          <li>
            <a href="#" className={styles.navItem}>
              <DashboardIcon className={styles.icon} />
              <Collapsible.Content asChild>
                <span className={styles.label}>Dashboard</span>
              </Collapsible.Content>
            </a>
          </li>
          {/* Outros itens... */}
        </ul>
      </nav>
    </Collapsible.Root>
  );
};