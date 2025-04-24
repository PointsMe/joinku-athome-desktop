import Vue from 'vue'

import {
    Button,
    Select,
    Option,
    Input,
    Radio,
    RadioGroup,
    RadioButton,
    Switch,
    Form,
    FormItem,
    Icon,
    Row,
    Col,
    DatePicker,
    TimeSelect,
    TimePicker,
    Tabs,
    TabPane,
    Tag,
    Image,
    Autocomplete,
    Dialog,
    Table,
    TableColumn,
    Cascader,
    Pagination,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Progress,
    Loading,
    MessageBox,
    Message,
} from 'element-ui';

Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Switch);
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag)
Vue.use(Image)
Vue.use(Autocomplete);
Vue.use(Dialog)
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Cascader)
Vue.use(Pagination)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Progress)
Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;
