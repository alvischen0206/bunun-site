# Service Flow Illustration Assets

Designed for the four cards in the `farewell` service-flow section.

## Files

- `report-confirmation.svg` - 通報確認
- `pickup-care.svg` - 接運安置
- `farewell-care.svg` - 告別處理
- `public-ledger.svg` - 費用公開

## Suggested UI Usage

```html
<img class="service-illustration-image" src="assets/service-flow/report-confirmation.svg" alt="通報確認">
```

Suggested CSS:

```css
.service-illustration {
  padding: 0;
  overflow: hidden;
}

.service-illustration-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 140px;
  object-fit: cover;
  border-radius: 8px;
}
```

Palette follows the current site variables: green, dark green, sky, gold, warm cream.
