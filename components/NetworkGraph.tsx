import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Attendee, Match, GraphNode, GraphEdge, MatchStatus } from '../types';
import { getGraphInsights } from '../services/geminiService';
import { Info, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface NetworkGraphProps {
  attendees: Attendee[];
  matches: Match[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ attendees, matches }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [insights, setInsights] = useState<{summary: string, suggestions: string[]} | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (!attendees.length || !svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Transform data
    const nodes: GraphNode[] = attendees.map(a => ({
      id: a.id,
      group: a.clusterId || 0,
      role: a.role,
      name: a.name,
      val: 5
    }));

    const links: GraphEdge[] = matches.map(m => ({
      source: m.sourceId,
      target: m.targetId,
      value: m.status === MatchStatus.HELD ? 3 : (m.status === MatchStatus.ACCEPTED ? 1 : 0.2)
    })).filter(l => l.value > 0.2); // Only show accepted+ for clarity

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink<GraphNode, GraphEdge>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(15));

    const g = svg.append("g");

    // Add zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });

    svg.call(zoom);

    const link = g.append("g")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", d => color(d.group.toString()))
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("title")
      .text(d => `${d.name} (${d.role})`);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [attendees, matches]);

  const fetchInsights = async () => {
      setLoadingInsights(true);
      const connectors = attendees.slice(0, 3).map(a => a.name); // Mock top connectors for demo logic
      const data = await getGraphInsights(attendees.length, matches.length, connectors);
      setInsights({ 
          summary: data.summary || "Network shows healthy distributed clusters.", 
          suggestions: data.suggestions || [] 
      });
      setLoadingInsights(false);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div ref={wrapperRef} className="flex-1 bg-white rounded-xl border border-brand-200 shadow-sm relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
        
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-brand-200 shadow-sm">
          <h3 className="text-sm font-semibold text-brand-900">Network Topology</h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-brand-500">
             <span className="w-2 h-2 rounded-full bg-blue-500"></span> Founder
             <span className="w-2 h-2 rounded-full bg-orange-500"></span> Investor
             <span className="w-2 h-2 rounded-full bg-green-500"></span> Operator
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
           <button className="p-2 bg-white border border-brand-200 rounded shadow-sm hover:bg-gray-50"><ZoomIn size={16} /></button>
           <button className="p-2 bg-white border border-brand-200 rounded shadow-sm hover:bg-gray-50"><ZoomOut size={16} /></button>
        </div>
      </div>

      <div className="w-80 flex flex-col gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl p-6 shadow-lg">
             <div className="flex items-center gap-2 mb-4 opacity-90">
                <Info size={18} />
                <h3 className="font-semibold">Graph Insights</h3>
             </div>
             
             {loadingInsights ? (
                 <div className="animate-pulse space-y-3">
                     <div className="h-4 bg-white/20 rounded w-3/4"></div>
                     <div className="h-20 bg-white/20 rounded"></div>
                 </div>
             ) : insights ? (
                 <div className="space-y-4">
                     <p className="text-sm leading-relaxed opacity-95 font-medium">{insights.summary}</p>
                     <div className="space-y-2 mt-4">
                         <p className="text-xs uppercase tracking-wider opacity-70 font-bold">Suggested Actions</p>
                         <ul className="space-y-2">
                             {insights.suggestions.map((s, i) => (
                                 <li key={i} className="text-xs bg-white/10 p-2 rounded border border-white/10 leading-snug">
                                     {s}
                                 </li>
                             ))}
                         </ul>
                     </div>
                 </div>
             ) : (
                 <div className="text-center py-6">
                     <p className="text-sm opacity-80 mb-4">Analyze the network structure to find bottlenecks and opportunities.</p>
                     <button 
                        onClick={fetchInsights}
                        className="w-full py-2 bg-white text-indigo-700 font-medium text-sm rounded hover:bg-indigo-50 transition-colors"
                     >
                         Run Analysis
                     </button>
                 </div>
             )}
          </div>

          <div className="bg-white rounded-xl border border-brand-200 p-4 shadow-sm flex-1">
             <h4 className="text-sm font-semibold text-brand-900 mb-3">Top Connectors</h4>
             <div className="space-y-3">
                 {attendees.slice(0, 5).map((a, i) => (
                     <div key={a.id} className="flex items-center justify-between group cursor-pointer p-1 hover:bg-gray-50 rounded">
                         <div className="flex items-center gap-2">
                             <span className="text-xs text-brand-400 font-mono w-4">{i+1}</span>
                             <img src={a.avatar} className="w-6 h-6 rounded-full" alt=""/>
                             <span className="text-sm text-brand-700 font-medium">{a.name}</span>
                         </div>
                         <div className="text-xs text-brand-400">{Math.floor(Math.random() * 20) + 5} cons</div>
                     </div>
                 ))}
             </div>
          </div>
      </div>
    </div>
  );
};
