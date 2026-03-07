import { useState } from "react";
import { 
  UserPlus, Search, MoreHorizontal, X, User, Activity, AlertTriangle, CheckCircle2, 
  MapPin, Shield, Copy, ExternalLink, ChevronDown, Bell
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell, PieChart, Pie } from "recharts";
import { useToast } from "@/components/ui/use-toast";

// ─── TYPES & DATA ──────────────────────────────────────────────────────────

type RiskLevel = "high" | "medium" | "low" | "zero";
type Role = "Admin" | "Member" | "Viewer";

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  email: string;
  department: string;
  role: Role;
  toolsUsed: number;
  risk: RiskLevel;
  lastActive: string;
}

const teamMembers: TeamMember[] = [
  { id: "1", initials: "YM", name: "Yash M", email: "yashm@devise.ai", department: "Engineering", role: "Admin", toolsUsed: 12, risk: "high", lastActive: "2 min ago" },
  { id: "2", initials: "SK", name: "Sarah K", email: "sarahk@devise.ai", department: "Design", role: "Member", toolsUsed: 8, risk: "medium", lastActive: "1hr ago" },
  { id: "3", initials: "AR", name: "Arjun R", email: "arjunr@devise.ai", department: "Product", role: "Member", toolsUsed: 6, risk: "low", lastActive: "3hr ago" },
  { id: "4", initials: "PM", name: "Priya M", email: "priyam@devise.ai", department: "Marketing", role: "Member", toolsUsed: 4, risk: "medium", lastActive: "1 day ago" },
  { id: "5", initials: "RT", name: "Rahul T", email: "rahult@devise.ai", department: "Engineering", role: "Member", toolsUsed: 9, risk: "high", lastActive: "30min ago" },
  { id: "6", initials: "NK", name: "Neha K", email: "nehak@devise.ai", department: "HR", role: "Member", toolsUsed: 1, risk: "low", lastActive: "3 days ago" },
  { id: "7", initials: "VS", name: "Vikram S", email: "vikrams@devise.ai", department: "Finance", role: "Member", toolsUsed: 0, risk: "zero", lastActive: "Never" },
  { id: "8", initials: "AM", name: "Anita M", email: "anitam@devise.ai", department: "Finance", role: "Member", toolsUsed: 0, risk: "zero", lastActive: "Never" },
  { id: "9", initials: "RJ", name: "Rohan J", email: "rohanj@devise.ai", department: "Engineering", role: "Member", toolsUsed: 7, risk: "high", lastActive: "45min ago" },
  { id: "10", initials: "DS", name: "Divya S", email: "divyas@devise.ai", department: "Marketing", role: "Viewer", toolsUsed: 2, risk: "low", lastActive: "2 days ago" },
];

const riskConf: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  high: { bg: "rgba(220,38,38,0.1)", text: "#DC2626", label: "High" },
  medium: { bg: "rgba(217,119,6,0.1)", text: "#D97706", label: "Medium" },
  low: { bg: "rgba(22,163,74,0.1)", text: "#16A34A", label: "Low" },
  zero: { bg: "transparent", text: "#C0C8D4", label: "—" },
};

const deptData = [
  { name: "Engineering", members: 8 },
  { name: "Design", members: 4 },
  { name: "Product", members: 3 },
  { name: "Marketing", members: 3 },
  { name: "Finance", members: 2 },
  { name: "HR", members: 2 },
  { name: "Operations", members: 2 },
];

const adoptionData = [
  { name: "High adopters", value: 8, color: "#FF5C1A" },
  { name: "Medium", value: 10, color: "#D97706" },
  { name: "Zero usage", value: 6, color: "#F0F2F5" },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export function TeamTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 relative w-full pb-10">
      
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1A1A2E] leading-tight mb-1">Team</h1>
          <p className="text-[14px] text-[#64748B]">Manage members and their AI usage permissions</p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 bg-[#FF5C1A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#E65318] transition-colors"
        >
          <UserPlus size={16} />
          + Invite Member
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 flex flex-col justify-between border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-[#FFF3EE]">
          <span className="text-xs font-bold tracking-wider text-[#FF5C1A] mb-3">TOTAL MEMBERS</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-[#1A1A2E] leading-none">24</span>
            <span className="text-sm font-medium text-[#16A34A] flex items-center gap-1">
              ↑ 2 added this week
            </span>
          </div>
        </Card>
        
        <Card className="p-5 flex flex-col justify-between border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-white">
          <span className="text-xs font-bold tracking-wider text-[#94A3B8] mb-3">POWER USERS</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-[#1A1A2E] leading-none">8</span>
            <span className="text-sm text-[#64748B] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> High AI adoption
            </span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-white">
          <span className="text-xs font-bold tracking-wider text-[#94A3B8] mb-3">ZERO USAGE</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-[#1A1A2E] leading-none">6</span>
            <span className="text-sm text-[#64748B] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> No AI detected
            </span>
          </div>
        </Card>
      </div>

      {/* ── Table Container ── */}
      <Card className="flex flex-col border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
        
        {/* Table Header Row */}
        <div className="flex items-center justify-between p-5 border-b border-[#F0F2F5]">
          <h2 className="text-base font-semibold text-[#1A1A2E]">All Members</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#FF5C1A] focus:bg-white transition-colors w-[240px]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F0F2F5]">
                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-[#94A3B8]">MEMBER</th>
                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-[#94A3B8]">DEPARTMENT</th>
                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-[#94A3B8]">ROLE</th>
                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-[#94A3B8]">AI TOOLS USED</th>
                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-[#94A3B8]">RISK LEVEL</th>
                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-[#94A3B8]">LAST ACTIVE</th>
                <th className="px-5 py-3 text-xs font-semibold tracking-wider text-[#94A3B8] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m, idx) => {
                const conf = riskConf[m.risk];
                const isLast = idx === filteredMembers.length - 1;
                return (
                  <tr 
                    key={m.id} 
                    onClick={() => setSelectedMember(m)}
                    className="group hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    style={{ borderBottom: isLast ? "none" : "1px solid #F0F2F5" }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FF5C1A] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {m.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[14px] text-[#1A1A2E] leading-tight">{m.name}</span>
                          <span className="text-[12px] text-[#94A3B8] leading-tight mt-0.5">{m.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[14px] text-[#1A1A2E]">{m.department}</td>
                    <td className="px-5 py-3 text-[14px] text-[#1A1A2E]">{m.role}</td>
                    <td className="px-5 py-3 text-[14px] text-[#1A1A2E]">{m.toolsUsed} tools</td>
                    <td className="px-5 py-3">
                      {m.risk === "zero" ? (
                        <span className="text-[#C0C8D4] font-medium">—</span>
                      ) : (
                        <div 
                          className="px-2.5 py-1 rounded-full text-xs font-medium inline-block"
                          style={{ backgroundColor: conf.bg, color: conf.text }}
                        >
                          {conf.label}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-[#64748B]">{m.lastActive}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="relative inline-block" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1A1A2E] hover:bg-[#F0F2F5] transition-colors"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {openMenu === m.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-[#F0F2F5] shadow-[0_12px_24px_rgba(0,0,0,0.12)] rounded-xl py-1 z-20 text-left">
                              <button className="w-full px-4 py-2 text-sm text-[#1A1A2E] hover:bg-[#F8FAFC] text-left">View Usage Report</button>
                              <button className="w-full px-4 py-2 text-sm text-[#1A1A2E] hover:bg-[#F8FAFC] text-left">Edit Role</button>
                              <button className="w-full px-4 py-2 text-sm text-[#1A1A2E] hover:bg-[#F8FAFC] text-left">Suspend Access</button>
                              <button className="w-full px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] text-left">Remove Member</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Bottom Section Options ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Department Breakdown */}
        <Card className="p-5 border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-white rounded-2xl flex flex-col">
          <h3 className="text-[16px] font-semibold text-[#1A1A2E] mb-6">Department Breakdown</h3>
          <div className="flex-1 w-full" style={{ minHeight: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={deptData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 13 }} width={90} />
                <RechartsTooltip cursor={{ fill: "#F8FAFC" }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="members" radius={[0, 4, 4, 0]} barSize={20}>
                  {deptData.map((d, i) => (
                    <Cell key={`cell-${i}`} fill={d.name === "Engineering" ? "#FF5C1A" : "#E2E8F0"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right: AI Adoption Rate */}
        <Card className="p-5 border-none shadow-[0_2px_12px_rgba(0,0,0,0.04)] bg-white rounded-2xl flex flex-col relative">
          <h3 className="text-[16px] font-semibold text-[#1A1A2E] mb-4">AI Adoption Rate</h3>
          <div className="flex-1 w-full flex items-center justify-center relative" style={{ minHeight: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adoptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {adoptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-[#1A1A2E] leading-none mb-1">67%</span>
              <span className="text-xs text-[#64748B]">adoption rate</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Modals & Slide-overs ── */}
      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      <MemberDetailPanel member={selectedMember} onClose={() => setSelectedMember(null)} />

    </div>
  );
}

// ─── INVITE MEMBER MODAL ────────────────────────────────────────────────────

function InviteMemberModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: `Invite sent to ${email}`,
      description: "They will receive an email with instructions to join.",
      duration: 3000,
    });
    setEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[480px] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1A1A2E]">Invite Team Member</h2>
          <button onClick={onClose} className="p-2 text-[#94A3B8] hover:text-[#1A1A2E] hover:bg-[#F0F2F5] rounded-lg transition-colors">
            <X size={20} className="active:scale-95 transition-transform" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1A1A2E]">Email address</label>
            <input 
              required
              type="email" 
              placeholder="e.g. colleague@devise.ai" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#FF5C1A] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1A1A2E]">Department</label>
            <div className="relative">
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
              <select className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm appearance-none focus:outline-none focus:border-[#FF5C1A] focus:bg-white transition-colors">
                <option>Engineering</option>
                <option>Design</option>
                <option>Product</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>HR</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1A1A2E]">Role</label>
            <div className="relative">
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
              <select className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm appearance-none focus:outline-none focus:border-[#FF5C1A] focus:bg-white transition-colors">
                <option>Member</option>
                <option>Admin</option>
                <option>Viewer</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#F0F2F5]">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-[#64748B] hover:text-[#1A1A2E] hover:bg-[#F8FAFC] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF5C1A] hover:bg-[#E65318] hover:translate-y-[-1px] active:scale-[0.98] rounded-xl transition-all shadow-sm"
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MEMBER DETAIL PANEL (SLIDE-OVER) ───────────────────────────────────────

function MemberDetailPanel({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Panel */}
      <div 
        className="absolute top-0 right-0 h-full w-[480px] bg-white border-l border-[#F0F2F5] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Top Header Section */}
        <div className="flex flex-col items-center justify-center p-8 border-b border-[#F0F2F5] relative bg-[#FAFAFA]">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#1A1A2E] hover:bg-[#F0F2F5] rounded-lg transition-colors"
          >
            <X size={20} className="active:scale-95 transition-transform" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-[#FF5C1A] text-white flex items-center justify-center font-bold text-2xl shadow-md mb-4">
            {member.initials}
          </div>
          
          <h2 className="text-xl font-bold text-[#1A1A2E] leading-tight mb-1">{member.name}</h2>
          <p className="text-sm text-[#94A3B8] mb-3">{member.email}</p>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-[13px] font-medium text-[#1A1A2E] shadow-sm">
              {member.department}
            </span>
            <span className="px-3 py-1 bg-[#FFF3EE] border border-[#FDDCC8] rounded-full text-[13px] font-semibold text-[#FF5C1A] shadow-sm">
              {member.role}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          
          {/* AI Usage Summary */}
          <section>
            <h3 className="text-[13px] font-bold tracking-wider text-[#94A3B8] mb-4">AI USAGE SUMMARY</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-center">
                <span className="text-xs text-[#64748B] mb-1">Total events this month</span>
                <span className="text-xl font-bold text-[#1A1A2E]">1,248</span>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col justify-center">
                <span className="text-xs text-[#64748B] mb-1">Most used tool</span>
                <span className="text-[15px] font-bold text-[#1A1A2E] flex items-center gap-1.5 line-clamp-1">
                  {member.name === "Yash M" ? "ChatGPT" : "GitHub Copilot"} 
                  <span className="text-xs font-normal text-[#94A3B8]">(342)</span>
                </span>
              </div>
            </div>
            
            <div className="mt-4 p-4 border border-[#E2E8F0] rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1A1A2E]">Risk Score</span>
                <span className="text-sm font-bold text-[#DC2626]">78/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F0F2F5] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#16A34A] via-[#D97706] to-[#DC2626]" style={{ width: '78%' }} />
              </div>
            </div>
          </section>

          {/* Top Tools Used */}
          <section>
            <h3 className="text-[13px] font-bold tracking-wider text-[#94A3B8] mb-4">TOP TOOLS USED</h3>
            <div className="flex flex-col gap-3">
              {[
                { name: "ChatGPT", pct: 85, color: "#10A37F" },
                { name: "GitHub Copilot", pct: 60, color: "#7472df" },
                { name: "Cursor", pct: 40, color: "#1A1A2E" },
                { name: "Midjourney", pct: 25, color: "#FF5C1A" },
                { name: "Notion AI", pct: 15, color: "#000000" },
              ].map((t, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1A1A2E] font-medium">{t.name}</span>
                    <span className="text-[#64748B] text-xs font-semibold">{t.pct * 4} events</span>
                  </div>
                  <div className="w-full h-[6px] rounded-full bg-[#F0F2F5]">
                    <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold tracking-wider text-[#94A3B8]">RECENT ACTIVITY</h3>
              <button className="text-[13px] font-medium text-[#FF5C1A] hover:underline">View all</button>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { action: "Used ChatGPT via Web", time: "10 min ago", risk: "low" },
                { action: "API call to Claude 3", time: "25 min ago", risk: "high" },
                { action: "Midjourney prompt generation", time: "1 hr ago", risk: "medium" },
                { action: "File upload to unknown AI", time: "2 hrs ago", risk: "high" },
              ].map((ev, i) => {
                const badge = ev.risk === "high" ? riskConf.high : ev.risk === "medium" ? riskConf.medium : riskConf.low;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#F0F2F5] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <Activity size={16} className="text-[#94A3B8]" />
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium text-[#1A1A2E] leading-tight mb-0.5">{ev.action}</span>
                      <span className="text-xs text-[#94A3B8]">{ev.time}</span>
                    </div>
                    <div 
                      className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      {badge.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Permissions (Toggles) */}
          <section className="mb-8">
            <h3 className="text-[13px] font-bold tracking-wider text-[#94A3B8] mb-4">PERMISSIONS</h3>
            <div className="flex flex-col gap-0 border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#FAFAFA]">
              
              <PermissionToggle label="Can use approved tools" defaultOn={true} />
              <PermissionToggle label="Can request new tools" defaultOn={true} />
              <PermissionToggle label="Receives alert notifications" defaultOn={false} />
              <PermissionToggle label="Admin access" defaultOn={member.role === "Admin"} isLast />

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// ─── HELPER: PERMISSION TOGGLE ──────────────────────────────────────────────

function PermissionToggle({ label, defaultOn, isLast }: { label: string; defaultOn: boolean; isLast?: boolean }) {
  const [isOn, setIsOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between p-4 bg-white" style={{ borderBottom: isLast ? 'none' : '1px solid #F0F2F5' }}>
      <span className="text-[14px] font-medium text-[#1A1A2E]">{label}</span>
      <button 
        onClick={() => setIsOn(!isOn)}
        className="relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer shadow-inner"
        style={{ backgroundColor: isOn ? '#16A34A' : '#E2E8F0' }}
      >
        <span 
          className="absolute left-[2px] top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow transition-transform duration-200 ease-in-out"
          style={{ transform: isOn ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}
