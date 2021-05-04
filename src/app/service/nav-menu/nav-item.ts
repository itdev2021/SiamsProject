export interface NavItem {
  Id: number,
  displayName: string;
  ParentId: number;
  Parent: number;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavItem[];
}