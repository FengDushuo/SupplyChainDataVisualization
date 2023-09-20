

var file = "/"+document.getElementById("jsonpath").value;;
var count_file = '/static/data/count3.json';
var city = file.split("/")[3].split(".")[0]+'3';
console.log(city);
var city1 = '南京国际博览中心3';
var type = '空气炸锅';
var type1 = '空气炸锅';
var flag=0;

const order = "desc";
  const width1 = 480;
  const height1 = 480;

  var colors1 = {
    "空气炸锅": "#65B252",
    "电蒸锅": "#3896ED",
    "料理机": "#F36EA7",
    "榨汁机": "#9454E6",
    "早餐机": "#FF8800",
    "电炖锅": "#EB7E6A",
    "电饼铛": "#FFD135",
    "豆浆机": "#6A53EC"
  };


function suiJi(m,n){
  return m+parseInt(Math.random()*(n-m+1))
}

function yanSe(){
  var result = "#"
  for(var i = 0; i<6; i++){
      result +=suiJi(0,15).toString(16)
  }
  return result;
  //生成一个随机颜色编码#000000-#ffffff
}



function mousePosition(ev){ 
    ev = ev || window.event; 
    if(ev.pageX || ev.pageY){ 
        return {x:ev.pageX, y:ev.pageY}; 
    } 
    return { 
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
        y:ev.clientY + document.body.scrollTop - document.body.clientTop 
    }; 
}   

function generateChart(data) {
  const bubble = data => d3.pack()
      .size([width1, height1])
      .padding(2)(d3.hierarchy({ children: data })
      .sum(d => d.money))
      .sort(function (a, b) {
        const mod = order === "desc" ? -1 : 1;
        return mod * (a.value - b.value);
      });

  const root = bubble(data);
  const tooltip = d3.select('.tooltip');

  var focus = root,
      view,
      margin = 20;

  const svg = d3.select('#bubble-chart')
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("cursor", "pointer")
      .style("clip-path",`circle(50%)`)
      .style('width', width1)
      .style('height', height1)
      .on("click", (event, d) => (zoom(event, root), event.stopPropagation()));
  
  var diameter = width1;

  const node = svg.selectAll()
      .data(root.children)
      .enter().append('g')
      .attr('transform', `translate(${width1 / 2}, ${height1 / 2})`);
  
  const circle = node.append('circle')
      .style('fill', d => colors1[d.data.category])
      .on('mouseover', function (e, d) {
              tooltip.select('#company').text(d.data.name).attr("font-family", "Microsoft Yahei");
              tooltip.select('#money').text('注册资金：'+ (d.data.money == ""?"无":d.data.money)).attr("font-family", "Microsoft Yahei");
              tooltip.select('#ground').text('经营范围：'+ (d.data.ground == ""?"无":d.data.ground)).attr("font-family", "Microsoft Yahei");
              tooltip.select('#property').text('企业性质：'+ (d.data.property == ""?"无":d.data.property)).attr("font-family", "Microsoft Yahei");
              tooltip.select('#address').text('企业地址：'+ (d.data.address == ""?"无":d.data.address)).attr("font-family", "Microsoft Yahei");
              tooltip.style('visibility', 'visible').style('z-index', 5);

          d3.select(this).style('stroke', '#222');
      })
      .on('mousemove', function(e) {
        var mousePos = mousePosition(e);
        var  xOffset = 20;
        var  yOffset = 25;
        tooltip.style('top', `${(mousePos.y - yOffset)}px`)
                .style('left', `${(mousePos.x + xOffset)}px`);})
      // .on('mousemove', e => tooltip.attr('transform', `translate(${width1 / 2}, ${height1 / 2})`))
      .on('mouseout', function () {
          d3.select(this).style('stroke', 'none');
          return tooltip.style('visibility', 'hidden');
      })
      .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
  
  const label = node.append('text')
      .attr('dy', 2)
      .style("display", "none")
          .attr("font-size",60)
          .attr("font-family", "Microsoft Yahei")
      .text(d => d.data.name);

//   node.transition()
//       .ease(d3.easeExpInOut)
//       .duration(1000)
//       .attr('transform', d => `translate(${d.x}, ${d.y})`);
  
  circle.transition()
      .ease(d3.easeExpInOut)
      .duration(1000)
      .attr('r', d => d.r);
  
  label.transition()
      .delay(700)
      .ease(d3.easeExpInOut)
      .duration(1000)
      .style('opacity', 1);
  
  zoomTo([root.x, root.y, root.r * 2]);

  function zoom(event, d) {
    var focus0 = focus; focus = d;
    var transition = d3.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return t => zoomTo(i(t));
        });
    label
        .style("fill-opacity", function(d) { return root !== focus ? 1 : 0; })
        .style("display", function(d) { return "inline" || (focus !== root); });
        // .on("start", function(d) {if (root === focus) this.style.display = "inline"; })
        // .on("end", function(d) {if (root !== focus) this.style.display = "none";});
    return svg.node();
  };

  function zoomTo(v) {
      var k = diameter / v[2]; view = v;
      console.log(diameter);
      console.log(v);
      node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    //   label.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
      circle.attr("r", function(d) { return d.r * k; });
  }

};

function generateChart1(data) {
const bubble = data => d3.pack()
    .size([width1, height1])
    .padding(2)(d3.hierarchy({ children: data })
    .sum(d => d.money))
    .sort(function (a, b) {
      const mod = order === "desc" ? -1 : 1;
      return mod * (a.value - b.value);
    });

const root1 = bubble(data);
const tooltip = d3.select('.tooltip');
var focus = root1,
      view,
      margin = 20;

const svg = d3.select('#bubble-chart1')
    .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
    .style("display", "block")
    .style("cursor", "pointer")
    .style("clip-path",`circle(50%)`)
    .style('width', width1)
    .style('height', height1)
    .on("click", (event, d) => (zoom(event, root1), event.stopPropagation()));

var diameter = width1;

const node = svg.selectAll()
    .data(root1.children)
    .enter().append('g')
    .attr('transform', `translate(${width1 / 2}, ${height1 / 2})`);

 

const circle = node.append('circle')
    .style('fill', d => colors1[d.data.category])
    .on('mouseover', function (e, d) {
        tooltip.select('#company').text(d.data.name);
            tooltip.select('#money').text('注册资金：'+ (d.data.money == ""?"无":d.data.money)).attr("font-family", "Microsoft Yahei");
              tooltip.select('#ground').text('经营范围：'+ (d.data.ground == ""?"无":d.data.ground)).attr("font-family", "Microsoft Yahei");
              tooltip.select('#property').text('企业性质：'+ (d.data.property == ""?"无":d.data.property)).attr("font-family", "Microsoft Yahei");
              tooltip.select('#address').text('企业地址：'+ (d.data.address == ""?"无":d.data.address)).attr("font-family", "Microsoft Yahei");
            tooltip.style('visibility', 'visible');

        d3.select(this).style('stroke', '#222');
    })
    .on('mousemove', function(e) {
      var mousePos = mousePosition(e);
      var  xOffset = 20;
      var  yOffset = 25;
      tooltip.style('top', `${(mousePos.y - yOffset)}px`)
                                .style('left', `${(mousePos.x + xOffset)}px`);})
    // .on('mousemove', e => tooltip.attr('transform', `translate(${width1 / 2}, ${height1 / 2})`))
    .on('mouseout', function () {
        d3.select(this).style('stroke', 'none');
        return tooltip.style('visibility', 'hidden');
    })
    .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

const label = node.append('text')
    .attr('dy', 2)
    .style("display", "none")
        .attr("font-size",60)
        .attr("font-family", "Microsoft Yahei")
        .text(d => d.data.name.substring(0, d.r));

// node.transition()
//     .ease(d3.easeExpInOut)
//     .duration(1000)
//     .attr('transform', d => `translate(${d.x}, ${d.y})`);

circle.transition()
    .ease(d3.easeExpInOut)
    .duration(1000)
    .attr('r', d => d.r);

label.transition()
    .delay(700)
    .ease(d3.easeExpInOut)
    .duration(1000)
    .style('opacity', 1)

zoomTo([root1.x, root1.y, root1.r * 2]);

function zoom(event, d) {
  var focus0 = focus; focus = d;
  var transition = d3.transition()
      .duration(event.altKey ? 7500 : 750)
      .tween("zoom", d => {
      const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
      return t => zoomTo(i(t));
      });
  label
      .style("fill-opacity", function(d) { return root1 !== focus ? 1 : 0; })
      .style("display", function(d) { return "inline" || (focus !== root1); });
      // .on("start", function(d) {if (root1 === focus) this.style.display = "none"; })
      // .on("end", function(d) {if (root1 !== focus) this.style.display = "inline";});
  return svg.node();
};

function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    console.log(diameter);
    console.log(v);
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
  //   label.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
}
};

(async () => {
    data = await d3.json(file).then(data => data);
    generateChart(data);
})();



var dataset = [1,1,1,1,1,1,1,1];

var dataset_name = ["空气炸锅","电蒸锅","料理机","榨汁机","早餐机","电炖锅","电饼铛","豆浆机"];

// let colors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd'];
// let colors = ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'];
var colors = ["#66CCCC","#FF99CC","#FF9999","#99CC66","#5151A2","#FF9900","#FF6600","#CCFF66"];

  var width = 540;
  var height = 540;
  var minOfWH = Math.min(width, height) / 2 +100;
  var initialAnimDelay = 300;
  var arcAnimDelay = 150;
  var arcAnimDur = 1000;
  var secDur = 1000;
  var secIndividualdelay = 150;

  var radius = void 0;

  // calculate minimum of width and height to set chart radius
  if (minOfWH > 380) {
    radius = 380;
  } else {
    radius = minOfWH;
  }


//   const svg = d3.select('.chart-wrapper')
//     .select('.pieChart')
//     .style('width', width)
//     .style('height', height)
//     .append("g");

  

//   svg.attr('transform', `translate(${width / 2}, ${height / 2})`);

//   var startAngle = function(d, i) {
//       return (i+1)*45*(Math.PI / 180);
//   };

//   var endAngle = function(d, i) {
//       return (i+2)*45*(Math.PI / 180);
//   };

//   // for drawing slices
//   var arc = d3.arc().
//   outerRadius(radius * 0.72).
//   innerRadius(radius * 0.65)
//   .startAngle(startAngle)
//   .endAngle(endAngle)
//  ;

//   // for labels and polylines
//   var outerArc = d3.arc().
//   innerRadius(radius * 0.75).
//   outerRadius(radius * 0.75)
//   .startAngle(startAngle)
//   .endAngle(endAngle);

//   // d3 color generator
//   // let c10 = d3.scale.category10();

//   var pie = d3.pie().
//   value(function (d) {return d;});

  var draw = function draw() {
    // svg.append("g").attr("class", "slices").attr("top", 200);
    // svg.append("g").attr("class", "labels");

    // // define slice
    // var slice = svg.select('.slices').
    // datum(dataset).
    // selectAll('path').
    // data(pie);
    // slice.
    // enter().append('path').
    // attr(
    //   'fill', function fill(d, i) {return colors[i];}).
    // attr('d', arc).
    // attr('id', function(d, i) {
    //     return 'arc' + i ;
    // }).
    // attr('stroke-width', '5px').
    // attr('transform', function transform(d, i) {return 'rotate(-180, 0, 0)';} ).
    // style('opacity', 0).
    // style('top',200).
    // on('click', function (e) {piesingle(e)}).
    // on('dblclick', function (e) {piedouble(e)
      
    // }).
    // transition().
    // delay(function (d, i) {return i * arcAnimDelay + initialAnimDelay;}).
    // duration(arcAnimDur).
    // ease(d3.easeExpInOut).
    // style('opacity', 1).
    // attr('transform', 'rotate(0,0,0)');

    // slice.transition().
    // delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;}).
    // duration(secDur).
    // attr('stroke-width', '5px');

    // var midAngle = function midAngle(d) {return d.startAngle + (d.endAngle - d.startAngle) / 2;};
    
    // var text = svg.select(".slices").selectAll("text").
    // data(pie(dataset));

    // text.enter().
    // append('text').
    // attr('x', function(d, i) {
    //   const angle = ((i+1)*45 + 5) * (Math.PI / 180); // 文字略微偏移以保持在圆环上
    //   return (radius + 10) * Math.cos(angle) + width / 2;
    //     // return Math.round((0.78539815 ) * 180 / Math.PI);
    // })
    // .attr('y', function(d, i) {
    //   const angle = ((i+1)*45 + 5) * (Math.PI / 180); // 文字略微偏移以保持在圆环上
    //   return (radius + 10) * Math.cos(angle) + width / 2;
    //     // return ((75 * (i + 1)) - (1 + 75 * i)) >> 1;
    // }).
    // style("opacity", 0).
    // attr("font-size",60).
    // attr("transform",function(d){//位置设在中心处
    //   return "translate("+arc.centroid(d)+")";
    // }).
    // attr("text-anchor","middle").
    // style('fill', function (d, i) {return '#ffffff';}).
    // text(function (d, i) {return dataset_name[i];}).
    // // style('text-anchor', function (d) {return midAngle(d) < Math.PI ? "start" : "end";}).
    // transition().
    // delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;}).
    // duration(secDur).
    // style('opacity', 1);

    // text.append('textPath')
    // .attr('xlink:href', function(d, i) {
    //     return '#arc' + i;
    // })
    // .style('fill', '#000')
    // .text(function (d, i) {return dataset_name[i];});
    var  emblemText= ['浙  江  省', '江  苏  省', '上  海  市'];    
    circleText('.emblem');
    function   circleText (el, str) {
      let element = document.querySelector(el);
      emblemText.forEach((v, i) => {
        let span = document.createElement('span');
        span.innerHTML = `<pre style="color:white">${emblemText[i]}</pre>`
        let deg = (i) * 120 + 60;
        span.style.transform = `rotateZ(${deg}deg)`
        element.appendChild(span);
      })
    };
    const splitLongString = (str, count) => {
      const partLength = Math.round(str.length / count);
      const words = str.split(' ');
      const parts = [];
      str.split(' ').forEach(part => {
      if (!parts.length) {
        parts.push(part);
      }
      else {
        const last = parts[parts.length - 1];
        if (parts[parts.length - 1].length >= partLength)
        parts.push(part);
      else  
        parts[parts.length - 1] += ' ' + part;
      }
    });
    return parts;
    };
  
    const dataq = [
      
      {value: 1, text: "电蒸锅", color: '#666666'},
      {value: 1, text: "料理机", color: '#006634'},
      {value: 1, text: "榨汁机", color: '#66999A'},
      {value: 1, text: "早餐机", color: '#FEE100'},
      {value: 1, text: "电炖锅", color: '#FF7F00'},
      {value: 1, text: "电饼铛", color: '#6599FF'},
      {value: 1, text: "豆浆机", color: '#999999'},
      {value: 1, text: "空气炸锅", color: '#99CCCD'}];
    const svg = d3.select('.chart-wrapper')
    .select('.pieChart')
    .style('width', width)
    .style('height', height);
    const margin = 5;
    const arcWidth = 25;
    const radius = Math.min(width/2 - margin, height/2 - margin) - arcWidth / 2;
    const center = {x: width / 2, y: height / 2};

    let anglePos = 0;
    const angleOffset = 0.005;

    const sum = dataq.reduce((s, {value}) => s + value, 0);
    dataq.forEach(({value, text, color}, index) => {
      const angle = Math.PI * 2 * value / sum;
      const startAngle = anglePos + angleOffset;
      anglePos += angle;
      const endAngle = anglePos - angleOffset;
      const start = {
        x: center.x + radius * Math.sin(startAngle),
        y: center.y + radius * -Math.cos(startAngle),
      };
      const end = {
        x: center.x + radius * Math.sin(endAngle),
        y: center.y + radius * -Math.cos(endAngle),
      };
      const flags = value / sum >= 0.5 ? '1 1 1' : '0 0 1';
      const pathId = `my-pie-chart-path-${index}`;
      const path = svg.append('path')
        .attr('id', pathId)
        .attr('d', `M ${start.x},${start.y} A ${radius},${radius} ${flags} ${end.x},${end.y}`)
        .style('stroke', color)
        .style('fill', 'none')
        .style('stroke-width', arcWidth);
        svg.selectAll("path")
        .on('click', function (e) {piesingle(e)})
        .on('dblclick', function (e) {piedouble(e)});
        
      const len = path.node().getTotalLength();
      
      const textElement = svg.append('text')
        .text(text)
        .attr('dy', 0)
        .attr('text-anchor', 'middle')
        .attr("font-size",25)
        .attr("font-family", "Microsoft Yahei")
        .style('fill', '#FFF')
        .style('opacity', 1)
        ;
      const width = textElement.node().getBBox().width;  
      let texts = [text];
      if (width > len)
        texts = splitLongString(text, Math.ceil(width / len));
            
      textElement.text(null);
      
      // const midAngle = anglePos - angle / 2;
      
      texts.forEach((t, i) => {
        const textPathId = `my-pie-chart-path-${index}-${i}`;
        const textRadius = radius - i * 12;
        const textStart = {
          x: center.x + textRadius * Math.sin(startAngle),
          y: center.y + textRadius * -Math.cos(startAngle),
        };
        const textEnd = {
          x: center.x + textRadius * Math.sin(endAngle),
          y: center.y + textRadius * -Math.cos(endAngle),
        };

        const path = svg.append('path')
          .attr('id', textPathId)
          .attr('d', `M ${textStart.x},${textStart.y} A ${textRadius},${textRadius} ${flags} ${textEnd.x},${textEnd.y}`)
          .style('stroke', 'none')
          .style('fill', 'none');
        
        textElement.append('textPath')
          .text(t)
          .attr('startOffset', (endAngle - startAngle) * textRadius / 2)
          .attr('href', `#${textPathId}`)
      });

    });
  };

draw();

var time = 200; //300以上，双击才生效
var timeOut = null;

function single (e) {
    console.log(e)
    clearTimeout(timeOut); // 清除第一个单击事件
    timeOut = setTimeout(function () {
        console.log('单击');
        const svg = d3.select('#bubble-chart');
          svg.selectAll("g").remove()
        .transition()
        .delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;}).
        duration(secDur);
        file = '/static/data/'+e.data.name+'3.json'; 
        city = e.data.name+'3';
          var names1 = []; //类别数组（用于存放饼图的类别）
          var brower1 = [];
          $.ajax({
            url: "/static/data/count3.json",
            data: {},
            type: 'GET',
            success: function(data) {
                //请求成功时执行该函数内容，result即为服务器返回的json对象
                $.each(data, function(index, item) {
                    names1.push(item.value); //挨个取出类别并填入类别数组
                    brower1.push({
                        name: item.country,
                        value: item.infected
                    });
                });
                hrFun(brower1);
            },
          });
          (async () => {
            var data = await d3.json(file).then(data => data);
            generateChart(data);
            
          })();
          // 单击事件的代码执行区域
          // ...
      }, time)
  }
  function double (e) {
      // var traget=document.getElementById('close');
      // traget.style.display="block";
      flag+=1;
      clearTimeout(timeOut); // 清除第二个单击事件
      const svg = d3.select('#bubble-chart1');
      svg.selectAll("g").remove()
    .transition()
    .delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;})
    .duration(secDur);
    var file1 = '/static/data/'+e.data.name+'3.json'; 
    city1 = e.data.name+'3'
    var names1 = []; //类别数组（用于存放饼图的类别）
    var brower1 = [];
    $.ajax({
      url: "/static/data/count3.json",
      data: {},
      type: 'GET',
      success: function(data) {
          //请求成功时执行该函数内容，result即为服务器返回的json对象
          $.each(data, function(index, item) {
              names1.push(item.value); //挨个取出类别并填入类别数组
              brower1.push({
                  name: item.country,
                  value: item.infected
              });
          });
          hrFun2(brower1);
      },
    });
    (async () => {
      if (flag%2==1){
        var traget=document.getElementById('main1');
        traget.style.display="block";
        d3.select('#bubble-chart1').selectAll("g").style('opacity',1);
        d3.select('.pieChart1').selectAll("g").style('opacity',1)
        var data = await d3.json(file1).then(data => data);
        generateChart1(data);
        draw1();
      }else{
        var traget=document.getElementById('main1');
        traget.style.display="none";
          d3.select('#bubble-chart1').selectAll("g").remove();
          d3.select('.pieChart1').selectAll("g").remove()
      }
    })();
    // 双击的代码执行区域
    // ...
}

function single1 (e) {
  console.log(e)
  clearTimeout(timeOut); // 清除第一个单击事件
  timeOut = setTimeout(function () {
      console.log('单击');
      const svg = d3.select('#bubble-chart1');
        svg.selectAll("g").remove()
      .transition()
      .delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;})
      .duration(secDur);
      file = '/static/data/'+e.data.name+'3.json'; 
      city1 = e.data.name+'3';
        var names1 = []; //类别数组（用于存放饼图的类别）
        var brower1 = [];
        $.ajax({
          url: "/static/data/count3.json",
          data: {},
          type: 'GET',
          success: function(data) {
              //请求成功时执行该函数内容，result即为服务器返回的json对象
              $.each(data, function(index, item) {
                  names1.push(item.value); //挨个取出类别并填入类别数组
                  brower1.push({
                      name: item.country,
                      value: item.infected
                  });
              });
              hrFun2(brower1);
          },
        });
        (async () => {
          var data = await d3.json(file).then(data => data);
          generateChart1(data);
        })();
        // 单击事件的代码执行区域
        // ...
    }, time)
}
function double1 (e) {
  clearTimeout(timeOut); // 清除第二个单击事件
  city1 = e.data.name+'3'
  var file1 = '/static/data/'+e.data.name+'3.json'; 
  var names1 = []; //类别数组（用于存放饼图的类别）
  var brower1 = [];
  const svg = d3.select('#bubble-chart');
    svg.selectAll("g").remove()
  .transition()
  .delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;})
  .duration(secDur);
  $.ajax({
    url: "/static/data/count3.json",
    data: {},
    type: 'GET',
    success: function(data) {
        //请求成功时执行该函数内容，result即为服务器返回的json对象
        $.each(data, function(index, item) {
            names1.push(item.value); //挨个取出类别并填入类别数组
            brower1.push({
                name: item.country,
                value: item.infected
            });
        });
        hrFun(brower1);
    },
  });
  (async () => {
    var data = await d3.json(file1).then(data => data);
    generateChart(data);
    draw();
  })();
  // 双击的代码执行区域
  // ...
}


function piesingle (e) {
console.log(e)
clearTimeout(timeOut); // 清除第一个单击事件
timeOut = setTimeout(function () {
    console.log('单击');
    const svg = d3.select('#bubble-chart');
      svg.selectAll("g").remove()
    .transition()
    .delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;})
    .duration(secDur);
      file = '/static/data/'+city+'-'+e.srcElement.nextSibling.lastChild.innerHTML+'.json'; 
    (async () => {
      var data = await d3.json(file).then(data => data);
      generateChart(data);
    })();
    // 单击事件的代码执行区域
    // ...
}, time)
}
function piedouble (e) {
  flag+=1;
  var traget=document.getElementById('close');
  traget.style.display="block";
  clearTimeout(timeOut); // 清除第二个单击事件
  const svg = d3.select('#bubble-chart1');
  svg.selectAll("g").remove()
.transition()
.delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;})
.duration(secDur);
  var file1 = '/static/data/'+city+'-'+e.srcElement.nextSibling.lastChild.innerHTML+'.json'; 
var names1 = []; //类别数组（用于存放饼图的类别）
var brower1 = [];
$.ajax({
  url: "/static/data/count3.json",
  data: {},
  type: 'GET',
  success: function(data) {
      //请求成功时执行该函数内容，result即为服务器返回的json对象
      $.each(data, function(index, item) {
          names1.push(item.value); //挨个取出类别并填入类别数组
          brower1.push({
              name: item.country,
              value: item.infected
          });
      });
      hrFun2(brower1);
  },
});
(async () => {
  if (flag%2==1){
    var traget=document.getElementById('main1');
    traget.style.display="block";
    d3.select('#bubble-chart1').selectAll("g").style('opacity',1);
    d3.select('.pieChart1').selectAll("g").style('opacity',1)
    var data = await d3.json(file1).then(data => data);
    generateChart1(data);
    draw1();
  }else{
    var traget=document.getElementById('main1');
    traget.style.display="none";
      d3.select('#bubble-chart1').selectAll("g").remove();
      d3.select('.pieChart1').selectAll("g").remove()
  }
})();
// 双击的代码执行区域
// ...
}

function piesingle1 (e) {
console.log(e)
clearTimeout(timeOut); // 清除第一个单击事件
timeOut = setTimeout(function () {
  console.log('单击');
  const svg = d3.select('#bubble-chart1');
    svg.selectAll("g").remove()
  .transition()
  .delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;})
  .duration(secDur);
    file = '/static/data/'+city1+'-'+e.srcElement.nextSibling.lastChild.innerHTML+'.json'; 
  (async () => {
    var data = await d3.json(file).then(data => data);
    generateChart1(data);
  })();
  // 单击事件的代码执行区域
  // ...
}, time)
}
function piedouble1 (e) {
clearTimeout(timeOut); // 清除第二个单击事件
var file1 = '/static/data/'+city1+'-'+e.srcElement.nextSibling.lastChild.innerHTML+'.json'; 
var names1 = []; //类别数组（用于存放饼图的类别）
var brower1 = [];
const svg = d3.select('#bubble-chart');
svg.selectAll("g").remove()
.transition()
.delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;})
.duration(secDur);
$.ajax({
url: "/static/data/count3.json",
data: {},
type: 'GET',
success: function(data) {
    //请求成功时执行该函数内容，result即为服务器返回的json对象
    $.each(data, function(index, item) {
        names1.push(item.value); //挨个取出类别并填入类别数组
        brower1.push({
            name: item.country,
            value: item.infected
        });
    });
    hrFun1(brower1);
},
});
(async () => {
var data = await d3.json(file1).then(data => data);
generateChart(data);
draw();
})();
// 双击的代码执行区域
// ...
}

  // const svg1 = d3.select('.pieChart1')
  //   .style('width', width)
  //   .style('height', height)
  //   .append("g");

  // svg1.attr('transform', `translate(${width / 2}, ${height / 2})`);


  // // for drawing slices
  // var arc1 = d3.arc().
  // outerRadius(radius * 0.8).
  // innerRadius(radius * 0.65);

  // // for labels and polylines
  // var outerArc1 = d3.arc().
  // innerRadius(radius * 0.85).
  // outerRadius(radius * 0.85);

  // // d3 color generator
  // // let c10 = d3.scale.category10();

  // var pie1 = d3.pie().
  // value(function (d) {return d;});

  var draw1 = function draw1() {
    // svg1.append("g").attr("class", "slices1");
    // svg1.append("g").attr("class", "labels1");

    // // define slice
    // var slice1 = svg1.select('.slices1').
    // datum(dataset).
    // selectAll('path').
    // data(pie);
    // slice1.
    // enter().append('path').
    // attr(
    //   'fill', function fill(d, i) {return colors[i];}).
    // attr('d', arc1).
    // attr('stroke-width', '25px').
    // attr('transform', function transform(d, i) {return 'rotate(-180, 0, 0)';} ).
    // style('opacity', 0).
    // on('click', function (e) {piesingle1(e)}).
    // on('dblclick', function (e) {piedouble1(e)}).
    // transition().
    // delay(function (d, i) {return i * arcAnimDelay + initialAnimDelay;}).
    // duration(arcAnimDur).
    // ease(d3.easeExpInOut).
    // style('opacity', 1).
    // attr('transform', 'rotate(0,0,0)');

    // slice1.transition().
    // delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;}).
    // duration(secDur).
    // attr('stroke-width', '5px');

    // var midAngle = function midAngle(d) {return d.startAngle + (d.endAngle - d.startAngle) / 2;};
    
    // var text1 = svg1.select(".slices1").selectAll("text").
    // data(pie(dataset));

    // text1.enter().
    // append('text').
    // attr('dy', '0.1em').
    // style("opacity", 0).
    // attr("font-size",60).
    // attr("transform",function(d){//位置设在中心处
    //   return "translate("+arc1.centroid(d)+")";
    // }).
    // attr("text-anchor","middle").
    // style('fill', function (d, i) {return '#ffffff';}).
    // text(function (d, i) {return dataset_name[i];}).
    // // style('text-anchor', function (d) {return midAngle(d) < Math.PI ? "start" : "end";}).
    // transition().
    // delay(function (d, i) {return arcAnimDur + i * secIndividualdelay;}).
    // duration(secDur).
    // style('opacity', 1);
    var  emblemText= ['浙  江  省', '江  苏  省', '上  海  市'];    
    circleText('.emblem1');
    function   circleText (el, str) {
      let element = document.querySelector(el);
      emblemText.forEach((v, i) => {
        let span = document.createElement('span');
        span.innerHTML = `<pre style="color:white">${emblemText[i]}</pre>`
        let deg = (i) * 120 + 60;
        span.style.transform = `rotateZ(${deg}deg)`
        element.appendChild(span);
      })
    };
    const splitLongString = (str, count) => {
      const partLength = Math.round(str.length / count);
      const words = str.split(' ');
      const parts = [];
      str.split(' ').forEach(part => {
      if (!parts.length) {
        parts.push(part);
      }
      else {
        const last = parts[parts.length - 1];
        if (parts[parts.length - 1].length >= partLength)
        parts.push(part);
      else  
        parts[parts.length - 1] += ' ' + part;
      }
    });
    return parts;
    };
  
    const dataq = [
      
      {value: 1, text: "电蒸锅", color: '#666666'},
      {value: 1, text: "料理机", color: '#006634'},
      {value: 1, text: "榨汁机", color: '#66999A'},
      {value: 1, text: "早餐机", color: '#FEE100'},
      {value: 1, text: "电炖锅", color: '#FF7F00'},
      {value: 1, text: "电饼铛", color: '#6599FF'},
      {value: 1, text: "豆浆机", color: '#999999'},
      {value: 1, text: "空气炸锅", color: '#99CCCD'}];
    const svg = d3.select('.chart-wrapper1')
    .select('.pieChart1')
    .style('width', width)
    .style('height', height);
    const margin = 5;
    const arcWidth = 25;
    const radius = Math.min(width/2 - margin, height/2 - margin) - arcWidth / 2;
    const center = {x: width / 2, y: height / 2};

    let anglePos = 0;
    const angleOffset = 0.005;

    const sum = dataq.reduce((s, {value}) => s + value, 0);
    dataq.forEach(({value, text, color}, index) => {
      const angle = Math.PI * 2 * value / sum;
      const startAngle = anglePos + angleOffset;
      anglePos += angle;
      const endAngle = anglePos - angleOffset;
      const start = {
        x: center.x + radius * Math.sin(startAngle),
        y: center.y + radius * -Math.cos(startAngle),
      };
      const end = {
        x: center.x + radius * Math.sin(endAngle),
        y: center.y + radius * -Math.cos(endAngle),
      };
      const flags = value / sum >= 0.5 ? '1 1 1' : '0 0 1';
      const pathId = `my-pie-chart-path-${index}`;
      const path = svg.append('path')
        .attr('id', pathId)
        .attr('d', `M ${start.x},${start.y} A ${radius},${radius} ${flags} ${end.x},${end.y}`)
        .style('stroke', color)
        .style('fill', 'none')
        .style('stroke-width', arcWidth);
        svg.selectAll("path")
        .on('click', function (e) {piesingle1(e)})
        .on('dblclick', function (e) {piedouble1(e)});
        
      const len = path.node().getTotalLength();
      
      const textElement = svg.append('text')
        .text(text)
        .attr('dy', 0)
        .attr('text-anchor', 'middle')
        .attr("font-size",25)
        .attr("font-family", "Microsoft Yahei")
        .style('fill', '#FFF')
        .style('opacity', 1)
        ;
      const width = textElement.node().getBBox().width;  
      let texts = [text];
      if (width > len)
        texts = splitLongString(text, Math.ceil(width / len));
            
      textElement.text(null);
      
      // const midAngle = anglePos - angle / 2;
      
      texts.forEach((t, i) => {
        const textPathId = `my-pie-chart-path-${index}-${i}`;
        const textRadius = radius - i * 12;
        const textStart = {
          x: center.x + textRadius * Math.sin(startAngle),
          y: center.y + textRadius * -Math.cos(startAngle),
        };
        const textEnd = {
          x: center.x + textRadius * Math.sin(endAngle),
          y: center.y + textRadius * -Math.cos(endAngle),
        };

        const path = svg.append('path')
          .attr('id', textPathId)
          .attr('d', `M ${textStart.x},${textStart.y} A ${textRadius},${textRadius} ${flags} ${textEnd.x},${textEnd.y}`)
          .style('stroke', 'none')
          .style('fill', 'none');
        
        textElement.append('textPath')
          .text(t)
          .attr('startOffset', (endAngle - startAngle) * textRadius / 2)
          .attr('href', `#${textPathId}`)
      });

    });
    
  };

  (async () => {
    var data2 = await d3.json(count_file).then(data => data);
  })();

//   const data2 = [
//     {"country":'宁波',"infected": 355},
//     {"country":'台州',"infected": 240},
//     {"country":'温州',"infected": 41},
//     {"country":'绍兴',"infected": 37},
//     {"country":'杭州',"infected": 29},
//     {"country":'嘉兴',"infected": 43},
//     {"country":'金华',"infected": 12},
//     {"country":'湖州',"infected": 8},
//     {"country":'衢州',"infected": 5},
//     {"country":'丽水',"infected": 4},
//     {"country":'舟山',"infected": 2},
//     {"country":'苏州',"infected": 180},
//     {"country":'无锡',"infected": 48},
//     {"country":'常州',"infected": 28},
//     {"country":'南京',"infected": 17},
//     {"country":'南通',"infected": 17},
//     {"country":'扬州',"infected": 5},
//     {"country":'镇江',"infected": 7},
//     {"country":'泰州',"infected": 8},
//     {"country":'徐州',"infected": 8},
//     {"country":'盐城',"infected": 6},
//     {"country":'宿迁',"infected": 2},
//     {"country":'连云港',"infected": 2},
//     {"country":'淮安',"infected": 2},
//     {"country":'松江区',"infected": 184},
//     {"country":'嘉定区',"infected": 131},
//     {"country":'青浦区',"infected": 96},
//     {"country":'浦东新区',"infected": 58},
//     {"country":'闵行区',"infected": 42},
//     {"country":'宝山区',"infected": 19},
//     {"country":'金山区',"infected": 18},
//     {"country":'黄浦区',"infected": 15},
//     {"country":'普陀区',"infected": 12},
//     {"country":'徐汇区',"infected": 7},
//     {"country":'静安区',"infected": 4},
//     {"country":'杨浦区',"infected": 4},
//     {"country":'长宁区',"infected": 2},
//     {"country":'虹口区',"infected": 2}
// ]

var names = []; //类别数组（用于存放饼图的类别）

var brower = [];
$.ajax({
    url: "/static/data/count3.json",
    data: {},
    type: 'GET',
    success: function(data) {
        //请求成功时执行该函数内容，result即为服务器返回的json对象
        $.each(data, function(index, item) {
            names.push(item.value); //挨个取出类别并填入类别数组
            brower.push({
                name: item.country,
                value: item.infected
            });
        });
        hrFun(brower);
    },
});
// 基于准备好的dom，初始化echarts实例

function hrFun(param) {
    var myChart = echarts.init(document.getElementById('main'));
    myChart.on('click', function (e) {
      single(e);
    });
    myChart.on('dblclick', function (e) {
      double(e);
    });
      var showData = [];
      var sum = 0, max =0;
      brower.forEach(item => {
          sum += item.value
          if(item.value >= max) max = item.value
      })
      // 放大规则
      var number = Math.round(max * 0.1)
      showData = brower.map(item => {
          return {
              value: item.value*3,
              name: item.name,
          }
      })
      var textdata = city.replace(/[0-9]/g, '');
      myChart.setOption({
          title: {
              show: true,
              text: textdata,
              x:'45', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
              y: '45', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
              textStyle: {
                // 主标题文本样式
                fontFamily: "Microsoft Yahei",
                fontSize: 25,
                fontStyle: "normal",
                fontWeight: "normal",
                color: "#FFF",
              },
          },
          toolbox: {
              show: true,
              feature: {
                  mark: {
                      show: true
                  },
                  dataView: {
                      show: true,
                      readOnly: false
                  },
                  restore: {
                      show: true
                  },
                  saveAsImage: {
                      show: true
                  }
              }
          },
          tooltip: {
            show: true,    // 是否显示提示框组件
            trigger: 'item',    // 触发类型（'item'，数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用；'axis'，坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用；'none'，不触发。）
            formatter: function (param){
                console.log(param.flag)
                return param.name +': '+ parseInt(param.value/3);
            },
            extraCssText: 'z-index: 9',
            showContent: true,     // 是否显示提示框浮层，默认显示
            alwaysShowContent: false,     // 是否永远显示提示框内容，默认情况下在移出可触发提示框区域后一定时间后隐藏
            triggerOn: 'mousemove|click',    // 提示框触发的条件（'mousemove'，鼠标移动时触发；'click'，鼠标点击时触发；'mousemove|click'，同时鼠标移动和点击时触发；'none'，不在 'mousemove' 或 'click' 时触发）
            confine: true,    // 是否将 tooltip 框限制在图表的区域内
            backgroundColor: 'rgba(50,50,50,0.7)',    // 提示框浮层的背景颜色
            padding: 5,    // 提示框浮层内边距，单位px
            textStyle: {
                color: '#FFF',     // 文字的颜色
                fontStyle: 'normal',    // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体） 
                fontWeight: 'normal',    // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
                fontSize: '20',    // 文字字体大小
                lineHeight: '50',    // 行高 
            }
          },
          series: [{
              name: '数量',
              type: 'pie',
              radius: [360, 420],
              center: ['50%', '50%'],
              roseType: 'area',
              label: {
                  padding: [3,10,10,5],
                  normal: {
                      show: true,
                      textStyle: { //标签的字体样式
                        color: '#ffffff', //字体颜色
                        fontStyle: 'oblique',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                        fontWeight: 'lighter',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
                        fontFamily: 'Microsoft Yahei', //文字的字体系列
                        fontSize: 12, //字体大小
                      },
                      position:[0,0],
                      rotate: 'radial'
                  },
                  
              },
              labelLine: {
                  normal: {
                      show: false
                  }
              },
              itemStyle: {
                  borderRadius: 8,
                  normal:{
                    color:'#A9A9A9'
                }
              },
              data: showData,
          }]
      });
  }

  function hrFun2(param) {
    var myChart = echarts.init(document.getElementById('main1'));
    myChart.on('click', function (e) {
      single1(e);
    });
    myChart.on('dblclick', function (e) {
      double1(e);
    });
    var showData = [];
    var sum = 0, max =0;
    brower.forEach(item => {
        sum += item.value
        if(item.value >= max) max = item.value
    })
    // 放大规则
    var number = Math.round(max * 0.1)
    showData = brower.map(item => {
        return {
            value: item.value*3,
            name: item.name,
        }
    })
    var textdata = city.replace(/[0-9]/g, '');
    myChart.setOption({
        title: {
            show: true,
            text: textdata,
        x:'45', //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
        y: '45', //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
        textStyle: {
          // 主标题文本样式
          fontFamily: "Microsoft Yahei",
          fontSize: 25,
          fontStyle: "normal",
          fontWeight: "normal",
          color: "#FFF",
        },
    },
      toolbox: {
          show: true,
          feature: {
              mark: {
                  show: true
              },
              dataView: {
                  show: true,
                  readOnly: false
              },
              restore: {
                  show: true
              },
              saveAsImage: {
                  show: true
              }
          }
      },
      tooltip: {
        show: true,    // 是否显示提示框组件
        trigger: 'item',    // 触发类型（'item'，数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用；'axis'，坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用；'none'，不触发。）
        formatter: function (param){
            return param.name +': '+parseInt(param.value/3);
        },
        extraCssText: 'z-index: 9',
        showContent: true,     // 是否显示提示框浮层，默认显示
        alwaysShowContent: false,     // 是否永远显示提示框内容，默认情况下在移出可触发提示框区域后一定时间后隐藏
        triggerOn: 'mousemove|click',    // 提示框触发的条件（'mousemove'，鼠标移动时触发；'click'，鼠标点击时触发；'mousemove|click'，同时鼠标移动和点击时触发；'none'，不在 'mousemove' 或 'click' 时触发）
        confine: true,    // 是否将 tooltip 框限制在图表的区域内
        backgroundColor: 'rgba(50,50,50,0.7)',    // 提示框浮层的背景颜色
        padding: 5,    // 提示框浮层内边距，单位px
        textStyle: {
            color: '#FFF',     // 文字的颜色
            fontStyle: 'normal',    // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体） 
            fontWeight: 'normal',    // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
            fontSize: '20',    // 文字字体大小
            lineHeight: '50',    // 行高 
        }
      },
      
      series: [{
          name: '数量',
          type: 'pie',
          radius: [360, 420],
          center: ['50%', '50%'],
          roseType: 'area',
          label: {
              padding: [3,10,10,5],
              normal: {
                  show: true,
                  textStyle: { //标签的字体样式
                    color: '#ffffff', //字体颜色
                    fontStyle: 'oblique',//文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
                    fontWeight: 'lighter',//'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
                    fontFamily: 'Microsoft Yahei', //文字的字体系列
                    fontSize: 12, //字体大小
                  },
                  position:[0,0],
                  rotate: 'radial'
              },
              
          },
          labelLine: {
              normal: {
                  show: false
              }
          },
          itemStyle: {
              borderRadius: 8,
              normal:{
                color:'#A9A9A9'
            }
          },
          data: showData,
      }]
  });
}


var click2color = document.getElementById("colorchange");
click2color.onclick = function(){
  for (var key in colors1) {
      colors1[key]=yanSe()
  }
  const svg = d3.select('#bubble-chart');
  svg.selectAll("g").style('opacity',0)
  generateChart(data);
  draw();
}

  var closeall = document.getElementById("close");
  closeall.onclick = function(){
      var traget=document.getElementById('main1');
      traget.style.display="none";
      d3.select('#bubble-chart1').selectAll("g").remove();
      d3.select('.pieChart1').selectAll("g").remove()
      
    }

