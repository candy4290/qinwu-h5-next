/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface CanvasLockProps {
    callBack?: (psw: string) => void;
    style?: React.CSSProperties;
}
const CanvasLock = forwardRef((props: CanvasLockProps, ref) => {
    const {
        callBack,
        style
    } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<any>({
        ctx: null,
        width: 0,
        height: 0,
        devicePixelRatio: 0,
        type:3, /* 行列数 */
        r: '',// 公式计算
        point: [], 
        arr: [], // 原始点位
        restPoint: [], 
        canvas: '',
        tip:'',
        touchFlag: false
    });
    useImperativeHandle(ref, () => ({
        success,
        error,
        reset,
    }));

    useEffect(() => {
        init();
        bindEvent();
        return () => {
            unbindEvent();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function init() {
        initDom();
        ctxRef.current.point = [];

        const canvas = canvasRef.current;
        ctxRef.current.touchFlag = false;
        if (canvas) {
            ctxRef.current.ctx = canvas.getContext('2d');
            createCircle();
        }
    }

    function initDom() {
        ctxRef.current.type = Number(ctxRef.current.type) || 3;
        ctxRef.current.devicePixelRatio = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;
        const width = ctxRef.current.width || 320;
        const height = ctxRef.current.height || 320;

        // 高清屏缩放
        if (canvas) {
            /* 画布大小 */
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            /* 画纸大小 */
            canvas.height = height * ctxRef.current.devicePixelRatio;
            canvas.width = width * ctxRef.current.devicePixelRatio;
        }
    }

    function createCircle() { /* 创建解锁点的坐标，根据canvas的大小来平均分配半径 */
        const n = ctxRef.current.type;
        let count = 0;
        ctxRef.current.r = ctxRef.current.ctx.canvas.width / (2 + 4*n);
        ctxRef.current.point = [];
        ctxRef.current.arr = [];
        ctxRef.current.restPoint = [];
        const r = ctxRef.current.r;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                count++;
                const obj = {
                    x: j*4*r + 3*r,
                    y: i*4*r + 3*r,
                    index: count
                };
                ctxRef.current.arr.push(obj);
                ctxRef.current.restPoint.push(obj);
            }
        }
        ctxRef.current.ctx.clearRect(0,0,ctxRef.current.ctx.canvas.width,ctxRef.current.ctx.canvas.height);

        for(let i = 0; i<ctxRef.current.arr.length; i++) {
            drawCle(ctxRef.current.arr[i].x,ctxRef.current.arr[i].y)
        }

    }

    function drawCle(x: number, y: number) { /* 初始化解锁密码画板 小圆圈 */
        ctxRef.current.ctx.strokeStyle = '#A6A6A6';
        ctxRef.current.ctx.lineWidth = 2;
        ctxRef.current.ctx.beginPath();
        ctxRef.current.ctx.arc(x, y, ctxRef.current.r, 0, Math.PI * 2, true);
        ctxRef.current.ctx.closePath();
        ctxRef.current.ctx.stroke();
    }

    function touchstart(e: TouchEvent) {
        e.preventDefault(); // 某些android的touchmove不宜触发
                const po = getPosition(e);
                for (let i=0; i<ctxRef.current.arr.length; i++) {
                    if (Math.abs(po.x - ctxRef.current.arr[i].x) < ctxRef.current.r && Math.abs(po.y - ctxRef.current.arr[i].y) < ctxRef.current.r) {
                        ctxRef.current.touchFlag = true;
                        ctxRef.current.point.push(ctxRef.current.arr[i]);
                        ctxRef.current.restPoint.splice(i, 1);
                    }
                }
    }

    function touchmove(e: TouchEvent) {
        if (ctxRef.current.touchFlag) {
            update(getPosition(e))
        }
    }

    function touchend() {
        if (ctxRef.current.touchFlag) {
            ctxRef.current.touchFlag = false;
            let password = ''
            for (let i = 0; i< ctxRef.current.point.length;i++) {
                password += ctxRef.current.point[i].index;
            }
            callBack && callBack(password)
        }
    }

    function bindEvent() {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('touchstart', touchstart);
            canvas.addEventListener('touchmove', touchmove);
            canvas.addEventListener('touchend', touchend)
        }
    }

    function unbindEvent() {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.removeEventListener('touchstart', touchstart);
            canvas.removeEventListener('touchmove', touchmove);
            canvas.removeEventListener('touchend', touchend)
        }
    }

    function getPosition(e: TouchEvent) { // 获取touch点相对于canvas的坐标
        const rect = (e.currentTarget as any).getBoundingClientRect(); /* 返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置。 */
        const po = { /* clientX视野相对于视口的距离，不受滚动距离影响 */
            x: (e.touches[0].clientX - rect.left) * ctxRef.current.devicePixelRatio,
            y: (e.touches[0].clientY - rect.top) * ctxRef.current.devicePixelRatio
        }
        return po;
    }

    function drawPoint(style: any) { /* 初始化圆心 */
        for (let i = 0; i < ctxRef.current.point.length; i++) {
            ctxRef.current.ctx.fillStyle = style;
            ctxRef.current.ctx.beginPath();
            ctxRef.current.ctx.arc(ctxRef.current.point[i].x,ctxRef.current.point[i].y, ctxRef.current.r/2.5,0,Math.PI * 2, true);
            ctxRef.current.ctx.closePath();
            ctxRef.current.ctx.fill();
        }
    }

    function update(po: {x: number, y: number}) { /* 核心变换方法在touchMove时候调用 */
        ctxRef.current.ctx.clearRect(0, 0, ctxRef.current.ctx.canvas.width, ctxRef.current.ctx.canvas.height);
        for (let i = 0; i<ctxRef.current.arr.length; i++) {
            drawCle(ctxRef.current.arr[i].x, ctxRef.current.arr[i].y);
        }
        drawPoint('#C8CED6');
        drawStatusPoint('#C8CED6');
        drawLine('#C8CED6', po);

        for(let i=0; i< ctxRef.current.restPoint.length; i++) {
            if (Math.abs(po.x - ctxRef.current.restPoint[i].x) < ctxRef.current.r && Math.abs(po.y - ctxRef.current.restPoint[i].y) < ctxRef.current.r) {
                // drawPoint(ctxRef.current.restPoint[i].x, ctxRef.current.restPoint[i].y);
                ctxRef.current.point.push(ctxRef.current.restPoint[i]);
                ctxRef.current.restPoint.splice(i, 1)
                break;
            }
        }
    }

    function drawStatusPoint(type: any) { /* 初始化线条状态 */
        for (let i = 0; i < ctxRef.current.point.length; i ++) {
            ctxRef.current.ctx.strokeStyle = type;
            ctxRef.current.ctx.beginPath();
            ctxRef.current.ctx.arc(ctxRef.current.point[i].x, ctxRef.current.point[i].y, ctxRef.current.r, 0, Math.PI * 2, true);
            ctxRef.current.ctx.closePath();
            ctxRef.current.ctx.stroke();
        }
    }

    function drawLine(style: any, po: {x: number, y: number}) { /* 解锁轨迹 */
        ctxRef.current.ctx.beginPath();
        ctxRef.current.ctx.strokeStyle = style;
        ctxRef.current.ctx.lineWidth = 3;
        ctxRef.current.ctx.moveTo(ctxRef.current.point[0].x, ctxRef.current.point[0].y);

        for (let i = 1; i< ctxRef.current.point.length; i++) {
            ctxRef.current.ctx.lineTo(ctxRef.current.point[i].x, ctxRef.current.point[i].y)
        }
        ctxRef.current.ctx.lineTo(po.x, po.y);
        ctxRef.current.ctx.stroke();
        ctxRef.current.ctx.closePath();
    }

    /* 重置绘制区域 */
    function reset() {
        createCircle();
    }

    /* 绘制成功效果色 */
    function success() {
        drawStatusPoint('#3a85ff');
        drawPoint('#3a85ff');
        drawLine('#3a85ff', ctxRef.current.point[ctxRef.current.point.length - 1]);
    }

    /* 绘制失败效果色 */
    function error() {
        drawStatusPoint('red');
        drawPoint('red');
        drawLine('red', ctxRef.current.point[ctxRef.current.point.length - 1]);
    }



    return (
        <canvas ref={canvasRef} style={style}>

        </canvas>
    )
})
export default CanvasLock;