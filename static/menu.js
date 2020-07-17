
window.MENU_CONFIG = [
    {
        index: "1",
        name: "设备管理",
        icon: "el-icon-cpu",
        menuItems: [
            {
                index: "1-1",
                name: "设备列表",
                routeName: "deviceList",

            },
            {
                index: "1-2",
                name: "设备数据",
                routeName: "deviceData",
            }
        ]
    },
    {
        index: "2",
        name: "摄像头管理",
        icon: "el-icon-cpu",
        menuItems: [
            {
                index: "2-1",
                name: "摄像头列表",
                routeName: "deviceList",

            },
            {
                index: "2-2",
                name: "摄像头数据",
                routeName: "deviceData",
            }
        ]
    },
];
console.log("window.MENU_CONFIG=", window.MENU_CONFIG);
