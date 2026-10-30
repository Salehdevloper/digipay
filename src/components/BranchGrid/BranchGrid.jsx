import { FiArrowLeft } from "react-icons/fi";
import { RiMapPin2Fill } from "react-icons/ri";

import { getBranchLink } from "../../data/branches";

import "./BranchGrid.css";

/**
 * One branch: pin, name, address and «مسیریابی».
 * «مسیریابی» opens the branch link in a NEW tab and is hidden when the
 * branch has no link (see data/branches/index.js).
 */
function BranchCard({ branch }) {
  const link = getBranchLink(branch);

  return (
    <li className="branch-card">
      <span className="branch-card__pin" aria-hidden="true">
        <RiMapPin2Fill />
      </span>

      <div className="branch-card__body">
        <div className="branch-card__head">
          <h3 className="branch-card__name">{branch.name}</h3>

          {link && (
            <a
              className="branch-card__route"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`مسیریابی تا شعبه ${branch.name}`}
            >
              مسیریابی
              <FiArrowLeft aria-hidden="true" />
            </a>
          )}
        </div>

        <p className="branch-card__address">{branch.address}</p>
      </div>
    </li>
  );
}

/** The grid of branch cards (3 columns on desktop, 1 on mobile). */
function BranchGrid({ branches }) {
  return (
    <ul className="branch-grid">
      {branches.map((branch) => (
        <BranchCard branch={branch} key={branch.id} />
      ))}
    </ul>
  );
}

export default BranchGrid;