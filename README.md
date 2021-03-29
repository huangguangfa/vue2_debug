<!-- 源码学习目录：入口先看package.json的dev指令看他执行的命令我们可以得知执行的是script下的config.js、在config.js文件得知rollup打包的入口文件在src\platforms\web\entry-runtime.js -->
<!-- 开始-- -->
<!-- 入口：src\core\instance\index.js -->

<!-- 
- 模版编译 👌
    1、获取template
    2、template -> AST树
    3、AST -> render函数 -> _c _v _s
    4、render函数 -> 虚拟节点
    5、设置patch -> 打补丁到真实DOM -->

 <!-- template模板先编译成VNode -->


<!-- 在new watcher的时候、会先去执行template转vnode挂载页面、转的时候会触发监听观察者模式、触发getter的依赖收集  dep.depend() -->
 <!-- _render 在entry-runtime-with-compiler 执行$mount的时候、包括option.render同样 -->





<!-- 一些关键性方法注入的位置 -->

<!-- 
    option.render方法  ==> entry-runtime-with-compiler.js    75行
    _update 方法  ==> src\core\instance\lifecycle.js         58行
    __patch__ 方法 \src\platforms\web\runtime\index.js       34行
 -->


<!-- test -->












