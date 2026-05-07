import { FolderKanban, Loader2, LogOut, Plus, Search, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios.js';
import { useUser } from '../context/UserContext.jsx';

export default function Home() {
    const [ projects, setProjects ] = useState([]);
    const [ projectName, setProjectName ] = useState('');
    const [ query, setQuery ] = useState('');
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ saving, setSaving ] = useState(false);
    const [ error, setError ] = useState('');
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const filteredProjects = useMemo(() => {
        const keyword = query.trim().toLowerCase();

        if (!keyword) {
            return projects;
        }

        return projects.filter(project => project.name.toLowerCase().includes(keyword));
    }, [ projects, query ]);

    const dashboardStats = useMemo(() => {
        const collaboratorCount = projects.reduce((total, project) => total + (project.users?.length || 0), 0);
        const filesCount = projects.reduce((total, project) => total + Object.keys(project.fileTree || {}).length, 0);

        return [
            { label: 'Projects', value: projects.length },
            { label: 'Collaborators', value: collaboratorCount },
            { label: 'Saved files', value: filesCount },
        ];
    }, [ projects ]);

    useEffect(() => {
        async function loadProjects() {
            try {
                const res = await axios.get('/projects/all');
                setProjects(res.data.projects);
            } catch (err) {
                setError(err.response?.data?.error || 'Could not load projects');
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, []);

    async function createProject(event) {
        event.preventDefault();
        const cleanName = projectName.trim();

        if (!cleanName) {
            setError('Project name is required');
            return;
        }

        setError('');
        setSaving(true);

        try {
            const res = await axios.post('/projects/create', { name: cleanName });
            setProjects(prev => [ res.data.project, ...prev ]);
            setProjectName('');
            setIsModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Could not create project');
        } finally {
            setSaving(false);
        }
    }

    async function logout() {
        try {
            await axios.get('/users/logout');
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }
    }

    return (
        <main className="min-h-screen bg-[#111827] text-white">
            <header className="border-b border-white/10 bg-[#0f172a]">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <div>
                        <h1 className="text-xl font-semibold tracking-wide sm:text-2xl">CollabServe AI</h1>
                        <p className="mt-1 text-sm text-slate-300">{user?.email}</p>
                    </div>

                    <button
                        onClick={logout}
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <div className="grid gap-3 sm:grid-cols-3">
                    {dashboardStats.map(item => (
                        <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                            <p className="text-sm text-slate-300">{item.label}</p>
                            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative min-w-0 md:w-80">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                            placeholder="Search projects"
                            className="w-full rounded-md border border-white/10 bg-white/[0.06] py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-emerald-400"
                        />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                        <Plus size={17} />
                        New Project
                    </button>
                </div>

                {error && (
                    <p className="mt-4 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {error}
                    </p>
                )}

                {loading ? (
                    <div className="mt-20 flex items-center justify-center gap-3 text-slate-300">
                        <Loader2 className="animate-spin" size={18} />
                        Loading projects...
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="mt-16 rounded-lg border border-dashed border-white/20 bg-white/[0.04] px-6 py-12 text-center">
                        <FolderKanban className="mx-auto text-slate-400" size={42} />
                        <h2 className="mt-4 text-lg font-semibold">No projects found</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            {query ? 'Try a different search term.' : 'Create a workspace to start chatting, coding, and previewing files.'}
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredProjects.map(project => (
                            <button
                                key={project._id}
                                onClick={() => navigate(`/project/${project._id}`)}
                                className="group min-h-40 rounded-lg border border-white/10 bg-white/[0.06] p-5 text-left transition hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-white/[0.09]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-emerald-500 text-base font-bold text-slate-950">
                                        {project.name[ 0 ]?.toUpperCase()}
                                    </div>
                                    <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300">
                                        {Object.keys(project.fileTree || {}).length} files
                                    </span>
                                </div>

                                <h2 className="mt-4 truncate text-lg font-semibold">{project.name}</h2>
                                <p className="mt-1 text-sm text-slate-400">Realtime editor, chat, AI assist, and browser preview.</p>

                                <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
                                    <span className="inline-flex items-center gap-2">
                                        <Users size={15} />
                                        {project.users?.length || 0} member{project.users?.length === 1 ? '' : 's'}
                                    </span>
                                    <span className="text-emerald-300 opacity-0 transition group-hover:opacity-100">
                                        Open
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4">
                    <form
                        onSubmit={createProject}
                        className="w-full max-w-md rounded-lg border border-white/10 bg-[#111827] p-5 shadow-2xl"
                    >
                        <h2 className="text-lg font-semibold">Create Project</h2>
                        <p className="mt-1 text-sm text-slate-400">Name the workspace that will hold files, chat, and members.</p>

                        <input
                            value={projectName}
                            onChange={event => setProjectName(event.target.value)}
                            placeholder="Project name"
                            className="mt-4 w-full rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
                            autoFocus
                            required
                        />

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-md border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                            >
                                {saving && <Loader2 className="animate-spin" size={15} />}
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}
