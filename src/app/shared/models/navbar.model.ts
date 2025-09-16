/**
 * Model of items for the navbar
 * - `label`: The display name of the navigation item;
 * - `route`: The Angular route path to navigate to;
 * - `iconComponent`: Icon as an Angular component;
 *    - `component`: Name of the angular component
 *    - `class`: CSS class apply to icon;
 * - `exact`: Optional, if `true`, the route match must be exact.
 */
export type NavbarNavigator = ({
  label: string
  route: string
  iconComponent: {
    component: string
    class: string
  }
  exact: boolean
} | {
  label: string
  route: string
  iconComponent: {
    component: string
    class: string
  }
  exact?: undefined
})[]
