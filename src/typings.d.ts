/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare var stripe: any;
declare var elements: any;
declare module "*.json" {
   const value: any;
   export default value;
}