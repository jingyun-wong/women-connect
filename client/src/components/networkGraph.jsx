import React from 'react'
import * as d3 from 'd3'
import useD3 from './useD3';

function NetworkGraph({data, id, owner}) {
    const ref = useD3(
        (svg) => {
            if (data.length !== 0){
                var simulation = d3.forceSimulation()
                                .force("link", d3.forceLink().distance(100).id(function(d) { return d.id; }))
                                .force("charge", d3.forceManyBody())
                                .force("center", d3.forceCenter(950 / 2, 280 / 2))
                                .force('collide', d3.forceCollide().radius(60))

                function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node
                    .attr("r", 20)
                    .style("stroke", function(d){
                        if (d.id === id || d.id === owner){
                            return "rgba(129, 178, 154, 1)"
                        }
                        else if(mutual_links.includes(d.id)){
                            return "rgba(255, 184, 184, 1)"
                        }
                        else{
                            return "#969696"
                        }
                    })
                    .style("stroke-width", function(d){
                        if (d.id === id || d.id === owner){
                            return "5px"
                        }
                        else if(mutual_links.includes(d.id)){
                            return "5px"
                        }
                        else{
                            return "0.5px"
                        }
                    })
                    .style("fill", "#d9d9d9")
                    .attr("cx", function (d) { return d.x + 10; })
                    .attr("cy", function(d) { return d.y - 10; });

                label
                    .attr("x", function(d) { return d.x - 30; })
                    .attr("y", function (d) { return d.y + 45; })
                    .attr('text-align','center')
                    .style("font-size", "12px").style("fill", "#4393c3").style('font-weight','2px');

                circle
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)

                // image
                //     .attr("x", d => d.x - 20 )
                //     .attr("y", d => d.y - 20 );
                }

                var linkedByIndex = {};
                data.links.forEach(function(d) {
                    linkedByIndex[d.source_id + "," + d.target_id] = 1;
                });

                var mutual_links = []
                for (let item in linkedByIndex){
                    let list_id = item.split(",")
                    let source = list_id[0]
                    let target = list_id[1]
                    if (source === owner){
                        console.log(source,target)
                        if ((id + "," + target) in linkedByIndex){
                            mutual_links.push(target)
                        }
                    }
                }

                console.log(mutual_links)

                // check the dictionary to see if nodes are linked
                function isConnected(a, b) {
                    return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.id == b.id;
                }

                function mouseOver(opacity) {
                    return function(d) {                        
                        // check all other nodes to see if they're connected
                        // to this one. if so, keep the opacity at 1, otherwise
                        // fade
                        node.style("stroke-opacity", function(o) {
                            let thisOpacity = isConnected(d, o) ? 1 : opacity;
                            return thisOpacity;
                        });
                        node.style("fill-opacity", function(o) {
                            let thisOpacity = isConnected(d, o) ? 1 : opacity;
                            return thisOpacity;
                        });
                        node.style("stroke", function(o){
                            let thisOpacity = isConnected(d, o) ?  "rgba(129, 178, 154, 0.6)" : "#ddd";
                            return thisOpacity;
                        });
                        node.style("stroke-width", function(o){
                            let thisOpacity = isConnected(d, o) ?  "2px" : "0.5px";
                            return thisOpacity;
                        });

                        // also style link accordingly
                        link.style("stroke-opacity", function(o) {
                            return o.source_id === d.id || o.target_id === d.id ? 1 : opacity;
                        });
                        link.style("stroke", function(o){
                            return o.source_id === d.id || o.target_id === d.id ? "rgba(129, 178, 154, 0.6)" : "#ddd";
                        });
                        link.style("stroke-width", function(o){
                            return o.source_id === d.id || o.target_id === d.id ? "2px" : 0.5;
                        });
                    }
                }

                function mouseOut() {
                    node.style("stroke", function(d){
                        if (d.id === id || d.id === owner){
                            return "rgba(129, 178, 154, 0.6)"
                        }
                        else if(mutual_links.includes(d.id)){
                            return "rgba(255, 184, 184, 1)"
                        }
                        else{
                            return "#969696"
                        }
                    })
                    node.style("stroke-width", function(d){
                        if (d.id === id || d.id === owner){
                            return "5px"
                        }
                        else if(mutual_links.includes(d.id)){
                            return "5px"
                        }
                        else{
                            return "0.5px"
                        }
                    })
                    node.style("stroke-opacity", 1 );
                    node.style("fill-opacity", 1);
                    link.style("stroke-opacity", 1);
                    link.style("stroke", "#aaa");
                    link.style('stroke-width',0.5)
                }

                data.links.forEach(function(d){
                    d.source = d.source_id;    
                    d.target = d.target_id;
                });    

                var link = svg.append("g")
                            .style("stroke-opacity", 1)
                            .style("stroke", "#aaa")
                            .selectAll("line")
                            .data(data.links)
                            .enter().append("line")
                            .join('line');
                            

                var node = svg.append("g")
                            .selectAll("line")
                            .data(data.nodes)
                            .attr("class", "nodes")
                            .join('g')
                            .on("mouseover", mouseOver(0.2))
                            .on("mouseout", mouseOut);
                    
                var defs = node.append('svg:defs');

                data.nodes.forEach(function(d) {
                    defs.append("svg:pattern")
                        .attr("width", '1')
                        .attr("height", '1')
                        .attr("x", d => d.x )
                        .attr("y", d => d.y )
                        .attr("id", "grump_avatar" + d.id)
                            .append("svg:image")
                            .attr("xlink:href", d.img)
                            .attr("width", 60)
                            .attr("height", 60)
                            
                    });

                var circle = node.append("circle")
                            .attr("r", 30)
                            .attr("fill", 
                                function(d){
                                    if (d.id === id || d.id === owner){
                                        return "rgba(129, 178, 154, 0.6)"
                                    }
                                    else{
                                        return "white"
                                    }
                                })
                            .style("fill", function (d) { return "url(#grump_avatar" + d.id + ")"});

                 // var circle =  node.append("circle")
                //                 .attr("r", 30)
                //                 .attr("fill", function(d){
                //                     if (d.id === id || d.id === owner){
                //                         return "white"
                //                     }
                //                     else{
                //                         return "white"
                //                     }
                //                 })

                // var circle = node.append('clipPath')
                //     .attr('id','clipObj')  
                //             .append('circle')
                //             .attr('r',30);

                // var image = node.append('image')
                //     .attr('xlink:href',  function(d) { return d.img;})
                //     .attr('width',40)
                //     .attr('height',40)
                //     .attr('transform','translate('+parseInt(40/2)+','+parseInt(40/2)+')')
                //     .attr('clip-path','url(#clipObj)');
                // ;
                                    
                // var image = node.append('svg:image')
                //                 .attr('width', 40)
                //                 .attr('height', 40)
                //                 .attr("xlink:href",  function(d) { return d.img;})
                //                 .style('border-radius','50%')

                var label = svg.append("g")
                                .attr("class", "labels")
                                .selectAll("text")
                                .data(data.nodes)
                                .enter().append("text")
                                        .attr("class", "label")
                                        .text(function(d) { return d.name; })
                                        
                simulation
                    .nodes(data.nodes)
                    .on("tick", ticked)
                
                simulation.force("link")
                    .links(data.links);
        }},
        [data.length]
    );
    

    return(
        <svg ref = {ref}
            style={{
            height: 300,
            width: "100%",
            marginRight: "0px",
            marginLeft: "0px",
        }}>
        </svg>
    )
}

export default NetworkGraph;
