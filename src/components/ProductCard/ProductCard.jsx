import { FiCreditCard, FiImage, FiLayers, FiShoppingBag } from "react-icons/fi";

import { getStoreById } from "../../data/stores";
import {
  formatPrice,
  getDiscount,
  getInstallmentPrice,
  toPersianDigits,
} from "../../utils/format";
import { resolveImage } from "../../utils/resolveImage";

import "./ProductCard.css";

/* =========================================================
   Images
   Product photo: src/assets/images/products/<product id>.webp|png|jpg
   Store logo   : src/assets/images/brands/<store id>.svg|webp|png
   A missing file shows a placeholder / an icon, never an error.
========================================================= */

const PRODUCT_IMAGES = import.meta.glob(
  "../../assets/images/products/**/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" }
);

const BRAND_LOGOS = import.meta.glob(
  "../../assets/images/brands/*.{webp,png,jpg,jpeg,svg}",
  { eager: true, import: "default" }
);

const PAYMENT_TYPES = {
  loan: { label: "وام", icon: FiCreditCard },
  credit: { label: "اعتبار", icon: FiLayers },
};

/**
 * One product (used by every product slider).
 * Props: product  (see data/products.js)
 */
function ProductCard({ product }) {
  const {
    id,
    storeId,
    title,
    price,
    oldPrice,
    rating,
    installments,
    paymentTypes = [],
    href = "#",
  } = product;

  const image = resolveImage(PRODUCT_IMAGES, id);
  const logo = resolveImage(BRAND_LOGOS, storeId);
  const storeName = getStoreById(storeId)?.name ?? "";
  const discount = getDiscount(product);

  return (
    <a href={href} target="_blank" className="product-card">
      {/* ----- Photo ----- */}
      <div className="product-card__media">
        {image ? (
          <img
            className="product-card__image"
            src={image}
            alt=""
            loading="lazy"
            draggable={false}
          />
        ) : (
          <span className="product-card__placeholder" aria-hidden="true">
            <FiImage />
          </span>
        )}

        {/* store logo + rating */}
        <span className="product-card__badge">
          {logo ? (
            <img src={logo} alt="" loading="lazy" draggable={false} />
          ) : (
            <FiShoppingBag aria-hidden="true" />
          )}
          {rating && (
            <span className="product-card__rating">
              {toPersianDigits(rating.toFixed(1))}
            </span>
          )}
        </span>

        {/* installments, or "وام / اعتبار" chips */}
        {installments ? (
          <div className="product-card__overlay">
            <span className="product-card__installments">
              <strong>{toPersianDigits(installments)}</strong>
              قسط
            </span>

            <span className="product-card__installment-price">
              <strong>{formatPrice(getInstallmentPrice(product))}</strong>
              <small>تومانی</small>
            </span>
          </div>
        ) : (
          paymentTypes.length > 0 && (
            <div className="product-card__overlay product-card__overlay--chips">
              {paymentTypes.map((type) => {
                const { label, icon: Icon } = PAYMENT_TYPES[type] ?? {};
                if (!label) return null;

                return (
                  <span className="product-card__chip" key={type}>
                    <Icon aria-hidden="true" />
                    {label}
                  </span>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* ----- Details ----- */}
      <div className="product-card__body">
        {storeName && (
          <span className="product-card__store">
            <FiShoppingBag aria-hidden="true" />
            {storeName}
          </span>
        )}

        <h3 className="product-card__title">{title}</h3>

        <div className="product-card__pricing">
          {/* keeps its height without a discount, so prices line up */}
          <div
            className={`product-card__discount ${
              discount ? "" : "product-card__discount--empty"
            }`}
          >
            <span className="product-card__percent">
              {toPersianDigits(discount)} %
            </span>
            <del className="product-card__old-price">
              {oldPrice ? formatPrice(oldPrice) : ""}
            </del>
          </div>

          <div className="product-card__price">
            <strong>{formatPrice(price)}</strong>
            <small>تومان</small>
          </div>
        </div>
      </div>
    </a>
  );
}

export default ProductCard;