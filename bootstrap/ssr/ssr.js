import { Head, Link, createInertiaApp, router, useForm, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region resources/js/Pages/Admin/Categories/Create.jsx
var Create_exports$2 = /* @__PURE__ */ __exportAll({ default: () => Create$2 });
function Create$2() {
	const { data, setData, post, processing, errors } = useForm({ nama: "" });
	function submit(e) {
		e.preventDefault();
		post("/admin/categories");
	}
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-md",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "font-serif text-3xl",
				children: "Tambah Kategori"
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "mt-6 space-y-4 rounded-lg bg-white p-6 shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						htmlFor: "nama",
						className: "block text-sm font-medium",
						children: "Nama Kategori"
					}),
					/* @__PURE__ */ jsx("input", {
						id: "nama",
						type: "text",
						value: data.nama,
						onChange: (e) => setData("nama", e.target.value),
						className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
						placeholder: "Contoh: Wedding",
						autoFocus: true
					}),
					errors.nama && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-red-600",
						children: errors.nama
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-neutral-400",
						children: "Slug dibuat otomatis dari nama."
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: processing,
						className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50",
						children: processing ? "Menyimpan…" : "Simpan"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/admin/categories",
						className: "text-sm text-neutral-500 underline",
						children: "Batal"
					})]
				})]
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/Admin/Categories/Edit.jsx
var Edit_exports$2 = /* @__PURE__ */ __exportAll({ default: () => Edit$2 });
function Edit$2({ category }) {
	const { data, setData, put, processing, errors } = useForm({ nama: category.nama });
	function submit(e) {
		e.preventDefault();
		put(`/admin/categories/${category.id}`);
	}
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-md",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "font-serif text-3xl",
				children: "Ubah Kategori"
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "mt-6 space-y-4 rounded-lg bg-white p-6 shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						htmlFor: "nama",
						className: "block text-sm font-medium",
						children: "Nama Kategori"
					}),
					/* @__PURE__ */ jsx("input", {
						id: "nama",
						type: "text",
						value: data.nama,
						onChange: (e) => setData("nama", e.target.value),
						className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
						autoFocus: true
					}),
					errors.nama && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-red-600",
						children: errors.nama
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-neutral-400",
						children: "Slug ikut diperbarui otomatis."
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: processing,
						className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50",
						children: processing ? "Menyimpan…" : "Simpan Perubahan"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/admin/categories",
						className: "text-sm text-neutral-500 underline",
						children: "Batal"
					})]
				})]
			})]
		})
	});
}
//#endregion
//#region resources/js/Components/ConfirmModal.jsx
function ConfirmModal({ open, judul, pesan, onConfirm, onClose }) {
	if (!open) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-black/40",
			onClick: onClose
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "font-serif text-xl",
					children: judul
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-neutral-600",
					children: pesan
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex justify-end gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "rounded border border-neutral-300 px-4 py-2 text-sm",
						children: "Batal"
					}), /* @__PURE__ */ jsx("button", {
						onClick: onConfirm,
						className: "rounded bg-red-600 px-4 py-2 text-sm text-white",
						children: "Ya, Hapus"
					})]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/Pages/Admin/Categories/Index.jsx
var Index_exports$3 = /* @__PURE__ */ __exportAll({ default: () => Index$3 });
function Index$3({ categories }) {
	const { errors } = usePage().props;
	const [target, setTarget] = useState(null);
	function hapus() {
		router.delete(`/admin/categories/${target.id}`, { onFinish: () => setTarget(null) });
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-3xl",
						children: "Kategori"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-neutral-500",
						children: "Kelola kategori portofolio."
					})] }), /* @__PURE__ */ jsx(Link, {
						href: "/admin/categories/create",
						className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white",
						children: "+ Tambah Kategori"
					})]
				}),
				errors.delete && /* @__PURE__ */ jsx("div", {
					className: "mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
					children: errors.delete
				}),
				/* @__PURE__ */ jsxs("table", {
					className: "mt-6 w-full overflow-hidden rounded-lg bg-white text-sm shadow-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "border-b text-left text-neutral-500",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Nama"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Slug"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Jumlah Work"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 text-right font-medium",
								children: "Aksi"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: categories.map((category) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b last:border-0",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: category.nama
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-neutral-500",
								children: category.slug
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: category.works_count
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "px-4 py-3 text-right",
								children: [/* @__PURE__ */ jsx(Link, {
									href: `/admin/categories/${category.id}/edit`,
									className: "mr-3 text-neutral-900 underline",
									children: "Ubah"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setTarget(category),
									className: "text-red-600 underline",
									children: "Hapus"
								})]
							})
						]
					}, category.id)) })]
				}),
				categories.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "mt-6 text-center text-sm text-neutral-500",
					children: "Belum ada kategori. Tambahkan yang pertama."
				})
			]
		}), /* @__PURE__ */ jsx(ConfirmModal, {
			open: target !== null,
			judul: "Hapus Kategori",
			pesan: `Yakin ingin menghapus kategori "${target?.nama}"? Tindakan ini tidak dapat dibatalkan.`,
			onConfirm: hapus,
			onClose: () => setTarget(null)
		})]
	});
}
//#endregion
//#region resources/js/Layouts/AdminLayout.jsx
function AdminLayout({ children }) {
	const { url } = usePage();
	const menu = [
		{
			href: "/admin",
			label: "Dashboard"
		},
		{
			href: "/admin/categories",
			label: "Kategori"
		},
		{
			href: "/admin/works",
			label: "Works"
		},
		{
			href: "/admin/videos",
			label: "Videos"
		}
	];
	const aktif = (href) => href === "/admin" ? url === "/admin" : url.startsWith(href);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-neutral-50",
		children: [/* @__PURE__ */ jsx("header", {
			className: "border-b bg-white",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-8",
					children: [/* @__PURE__ */ jsxs(Link, {
						href: "/admin",
						className: "font-serif text-lg",
						children: ["DzarProject ", /* @__PURE__ */ jsx("span", {
							className: "text-xs text-neutral-400",
							children: "Admin"
						})]
					}), /* @__PURE__ */ jsx("nav", {
						className: "flex gap-4 text-sm",
						children: menu.map((item) => /* @__PURE__ */ jsx(Link, {
							href: item.href,
							className: aktif(item.href) ? "font-semibold text-neutral-900" : "text-neutral-500 hover:text-neutral-900",
							children: item.label
						}, item.href))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4 text-sm",
					children: [/* @__PURE__ */ jsx("a", {
						href: "/",
						className: "text-neutral-500 hover:text-neutral-900",
						children: "Lihat Situs →"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => router.post("/logout"),
						className: "text-red-600",
						children: "Keluar"
					})]
				})]
			})
		}), /* @__PURE__ */ jsx("main", {
			className: "mx-auto max-w-6xl px-6 py-8",
			children
		})]
	});
}
//#endregion
//#region resources/js/Pages/Admin/Dashboard.jsx
var Dashboard_exports = /* @__PURE__ */ __exportAll({ default: () => Dashboard });
function Dashboard({ auth, statistik }) {
	const kartu = [
		{
			href: "/admin/categories",
			label: "Kategori",
			jumlah: statistik.categories
		},
		{
			href: "/admin/works",
			label: "Works",
			jumlah: statistik.works
		},
		{
			href: "/admin/videos",
			label: "Videos",
			jumlah: statistik.videos
		}
	];
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [
		/* @__PURE__ */ jsx("h1", {
			className: "font-serif text-3xl",
			children: "Dashboard"
		}),
		/* @__PURE__ */ jsxs("p", {
			className: "mt-1 text-sm text-neutral-500",
			children: [
				"Selamat datang, ",
				auth.user.name,
				"."
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "mt-8 grid gap-4 md:grid-cols-3",
			children: kartu.map((k) => /* @__PURE__ */ jsxs(Link, {
				href: k.href,
				className: "rounded-lg bg-white p-6 shadow-sm transition hover:shadow",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-3xl font-semibold",
					children: k.jumlah
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-sm text-neutral-500",
					children: [k.label, " →"]
				})]
			}, k.href))
		})
	] });
}
//#endregion
//#region resources/js/Pages/Admin/Videos/Create.jsx
var Create_exports$1 = /* @__PURE__ */ __exportAll({ default: () => Create$1 });
function embedUrl$1(url) {
	const m = url?.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
	return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
function Create$1() {
	const { data, setData, post, processing, errors } = useForm({
		judul: "",
		youtube_url: "",
		urutan: 0
	});
	const preview = embedUrl$1(data.youtube_url);
	function submit(e) {
		e.preventDefault();
		post("/admin/videos");
	}
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-xl",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "font-serif text-3xl",
				children: "Tambah Video"
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "mt-6 space-y-4 rounded-lg bg-white p-6 shadow-sm",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "judul",
							className: "block text-sm font-medium",
							children: "Judul (opsional)"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "judul",
							type: "text",
							value: data.judul,
							onChange: (e) => setData("judul", e.target.value),
							className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
							placeholder: "Contoh: Film A & Z",
							autoFocus: true
						}),
						errors.judul && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600",
							children: errors.judul
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "youtube_url",
							className: "block text-sm font-medium",
							children: "Link YouTube"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "youtube_url",
							type: "url",
							value: data.youtube_url,
							onChange: (e) => setData("youtube_url", e.target.value),
							className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
							placeholder: "https://youtube.com/watch?v=…"
						}),
						errors.youtube_url && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600",
							children: errors.youtube_url
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "urutan",
							className: "block text-sm font-medium",
							children: "Urutan tampil"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "urutan",
							type: "number",
							min: "0",
							value: data.urutan,
							onChange: (e) => setData("urutan", Number(e.target.value)),
							className: "mt-1 w-32 rounded border border-neutral-300 px-3 py-2"
						}),
						errors.urutan && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600",
							children: errors.urutan
						})
					] }),
					preview && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "mb-1 text-sm text-neutral-500",
						children: "Pratinjau:"
					}), /* @__PURE__ */ jsx("iframe", {
						src: preview,
						title: "Pratinjau video",
						className: "aspect-video w-full rounded",
						allowFullScreen: true
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 pt-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50",
							children: processing ? "Menyimpan…" : "Simpan"
						}), /* @__PURE__ */ jsx(Link, {
							href: "/admin/videos",
							className: "text-sm text-neutral-500 underline",
							children: "Batal"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/Admin/Videos/Edit.jsx
var Edit_exports$1 = /* @__PURE__ */ __exportAll({ default: () => Edit$1 });
function embedUrl(url) {
	const m = url?.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
	return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
function Edit$1({ video }) {
	const { data, setData, put, processing, errors } = useForm({
		judul: video.judul ?? "",
		youtube_url: video.youtube_url,
		urutan: video.urutan
	});
	const preview = embedUrl(data.youtube_url);
	function submit(e) {
		e.preventDefault();
		put(`/admin/videos/${video.id}`);
	}
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-xl",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "font-serif text-3xl",
				children: "Ubah Video"
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "mt-6 space-y-4 rounded-lg bg-white p-6 shadow-sm",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "judul",
							className: "block text-sm font-medium",
							children: "Judul (opsional)"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "judul",
							type: "text",
							value: data.judul,
							onChange: (e) => setData("judul", e.target.value),
							className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
							autoFocus: true
						}),
						errors.judul && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600",
							children: errors.judul
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "youtube_url",
							className: "block text-sm font-medium",
							children: "Link YouTube"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "youtube_url",
							type: "url",
							value: data.youtube_url,
							onChange: (e) => setData("youtube_url", e.target.value),
							className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2"
						}),
						errors.youtube_url && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600",
							children: errors.youtube_url
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "urutan",
							className: "block text-sm font-medium",
							children: "Urutan tampil"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "urutan",
							type: "number",
							min: "0",
							value: data.urutan,
							onChange: (e) => setData("urutan", Number(e.target.value)),
							className: "mt-1 w-32 rounded border border-neutral-300 px-3 py-2"
						}),
						errors.urutan && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600",
							children: errors.urutan
						})
					] }),
					preview && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "mb-1 text-sm text-neutral-500",
						children: "Pratinjau:"
					}), /* @__PURE__ */ jsx("iframe", {
						src: preview,
						title: "Pratinjau video",
						className: "aspect-video w-full rounded",
						allowFullScreen: true
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 pt-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50",
							children: processing ? "Menyimpan…" : "Simpan Perubahan"
						}), /* @__PURE__ */ jsx(Link, {
							href: "/admin/videos",
							className: "text-sm text-neutral-500 underline",
							children: "Batal"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/Admin/Videos/Index.jsx
var Index_exports$2 = /* @__PURE__ */ __exportAll({ default: () => Index$2 });
function Index$2({ videos }) {
	const [target, setTarget] = useState(null);
	function hapus() {
		router.delete(`/admin/videos/${target.id}`, { onFinish: () => setTarget(null) });
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-4xl",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-3xl",
						children: "Videos"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-neutral-500",
						children: "Link YouTube untuk section Videos di landing page."
					})] }), /* @__PURE__ */ jsx(Link, {
						href: "/admin/videos/create",
						className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white",
						children: "+ Tambah Video"
					})]
				}),
				/* @__PURE__ */ jsxs("table", {
					className: "mt-6 w-full overflow-hidden rounded-lg bg-white text-sm shadow-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "border-b text-left text-neutral-500",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Video"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Judul"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Urutan"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 text-right font-medium",
								children: "Aksi"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: videos.map((video) => {
						const videoId = video.embed_url?.split("/").pop();
						return /* @__PURE__ */ jsxs("tr", {
							className: "border-b last:border-0",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: videoId ? /* @__PURE__ */ jsx("img", {
										src: `https://img.youtube.com/vi/${videoId}/default.jpg`,
										alt: "",
										className: "h-12 w-20 rounded object-cover",
										loading: "lazy"
									}) : /* @__PURE__ */ jsx("span", {
										className: "text-xs text-red-600",
										children: "Link tidak dikenali"
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-medium",
										children: video.judul || "(tanpa judul)"
									}), /* @__PURE__ */ jsx("div", {
										className: "max-w-xs truncate text-xs text-neutral-400",
										children: video.youtube_url
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: video.urutan
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-4 py-3 text-right",
									children: [/* @__PURE__ */ jsx(Link, {
										href: `/admin/videos/${video.id}/edit`,
										className: "mr-3 text-neutral-900 underline",
										children: "Ubah"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => setTarget(video),
										className: "text-red-600 underline",
										children: "Hapus"
									})]
								})
							]
						}, video.id);
					}) })]
				}),
				videos.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "mt-6 text-center text-sm text-neutral-500",
					children: "Belum ada video. Tambahkan link YouTube pertama."
				})
			]
		}), /* @__PURE__ */ jsx(ConfirmModal, {
			open: target !== null,
			judul: "Hapus Video",
			pesan: `Yakin ingin menghapus video "${target?.judul || target?.youtube_url}" dari landing page?`,
			onConfirm: hapus,
			onClose: () => setTarget(null)
		})]
	});
}
//#endregion
//#region resources/js/Pages/Admin/Works/Create.jsx
var Create_exports = /* @__PURE__ */ __exportAll({ default: () => Create });
function Create({ categories }) {
	const { data, setData, post, processing, errors } = useForm({
		judul: "",
		category_id: "",
		deskripsi: "",
		lokasi: "",
		youtube_url: "",
		show_on_landing: false,
		urutan: 0
	});
	function submit(e) {
		e.preventDefault();
		post("/admin/works");
	}
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-xl",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "font-serif text-3xl",
					children: "Tambah Work"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-neutral-500",
					children: "Satu work = satu sesi/album foto."
				}),
				categories.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "mt-6 rounded border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800",
					children: [
						"Belum ada kategori.",
						" ",
						/* @__PURE__ */ jsx(Link, {
							href: "/admin/categories/create",
							className: "underline",
							children: "Buat kategori dulu"
						}),
						" ",
						"sebelum menambah work."
					]
				}) : /* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "mt-6 space-y-4 rounded-lg bg-white p-6 shadow-sm",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "judul",
								className: "block text-sm font-medium",
								children: "Judul Work"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "judul",
								type: "text",
								value: data.judul,
								onChange: (e) => setData("judul", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
								placeholder: "Contoh: A & Z",
								autoFocus: true
							}),
							errors.judul && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.judul
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "category_id",
								className: "block text-sm font-medium",
								children: "Kategori"
							}),
							/* @__PURE__ */ jsxs("select", {
								id: "category_id",
								value: data.category_id,
								onChange: (e) => setData("category_id", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Pilih kategori…"
								}), categories.map((category) => /* @__PURE__ */ jsx("option", {
									value: category.id,
									children: category.nama
								}, category.id))]
							}),
							errors.category_id && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.category_id
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "lokasi",
								className: "block text-sm font-medium",
								children: "Lokasi (opsional)"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "lokasi",
								type: "text",
								value: data.lokasi,
								onChange: (e) => setData("lokasi", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
								placeholder: "Contoh: Bali"
							}),
							errors.lokasi && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.lokasi
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "deskripsi",
								className: "block text-sm font-medium",
								children: "Deskripsi singkat (opsional)"
							}),
							/* @__PURE__ */ jsx("textarea", {
								id: "deskripsi",
								rows: "3",
								value: data.deskripsi,
								onChange: (e) => setData("deskripsi", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
								placeholder: "Cerita singkat sesi ini…"
							}),
							errors.deskripsi && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.deskripsi
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "youtube_url",
								className: "block text-sm font-medium",
								children: "Link YouTube (opsional)"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "youtube_url",
								type: "url",
								value: data.youtube_url,
								onChange: (e) => setData("youtube_url", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
								placeholder: "https://youtube.com/watch?v=…"
							}),
							errors.youtube_url && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.youtube_url
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "urutan",
								className: "block text-sm font-medium",
								children: "Urutan tampil"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "urutan",
								type: "number",
								min: "0",
								value: data.urutan,
								onChange: (e) => setData("urutan", Number(e.target.value)),
								className: "mt-1 w-32 rounded border border-neutral-300 px-3 py-2"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-neutral-400",
								children: "Angka lebih kecil tampil lebih dulu."
							}),
							errors.urutan && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.urutan
							})
						] }),
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: data.show_on_landing,
								onChange: (e) => setData("show_on_landing", e.target.checked)
							}), "Tampilkan di landing page"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 pt-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: processing,
								className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50",
								children: processing ? "Menyimpan…" : "Simpan"
							}), /* @__PURE__ */ jsx(Link, {
								href: "/admin/works",
								className: "text-sm text-neutral-500 underline",
								children: "Batal"
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/Admin/Works/Edit.jsx
var Edit_exports = /* @__PURE__ */ __exportAll({ default: () => Edit });
function Edit({ work, categories }) {
	const { data, setData, put, processing, errors } = useForm({
		judul: work.judul,
		category_id: work.category_id,
		deskripsi: work.deskripsi ?? "",
		lokasi: work.lokasi ?? "",
		youtube_url: work.youtube_url ?? "",
		show_on_landing: work.show_on_landing,
		urutan: work.urutan
	});
	function submit(e) {
		e.preventDefault();
		put(`/admin/works/${work.id}`);
	}
	return /* @__PURE__ */ jsx("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-xl",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "font-serif text-3xl",
					children: "Ubah Work"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-neutral-500",
					children: work.judul
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "mt-6 space-y-4 rounded-lg bg-white p-6 shadow-sm",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "judul",
								className: "block text-sm font-medium",
								children: "Judul Work"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "judul",
								type: "text",
								value: data.judul,
								onChange: (e) => setData("judul", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
								autoFocus: true
							}),
							errors.judul && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.judul
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "category_id",
								className: "block text-sm font-medium",
								children: "Kategori"
							}),
							/* @__PURE__ */ jsxs("select", {
								id: "category_id",
								value: data.category_id,
								onChange: (e) => setData("category_id", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Pilih kategori…"
								}), categories.map((category) => /* @__PURE__ */ jsx("option", {
									value: category.id,
									children: category.nama
								}, category.id))]
							}),
							errors.category_id && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.category_id
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "lokasi",
								className: "block text-sm font-medium",
								children: "Lokasi (opsional)"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "lokasi",
								type: "text",
								value: data.lokasi,
								onChange: (e) => setData("lokasi", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2"
							}),
							errors.lokasi && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.lokasi
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "deskripsi",
								className: "block text-sm font-medium",
								children: "Deskripsi singkat (opsional)"
							}),
							/* @__PURE__ */ jsx("textarea", {
								id: "deskripsi",
								rows: "3",
								value: data.deskripsi,
								onChange: (e) => setData("deskripsi", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2"
							}),
							errors.deskripsi && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.deskripsi
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "youtube_url",
								className: "block text-sm font-medium",
								children: "Link YouTube (opsional)"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "youtube_url",
								type: "url",
								value: data.youtube_url,
								onChange: (e) => setData("youtube_url", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2"
							}),
							errors.youtube_url && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.youtube_url
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "urutan",
								className: "block text-sm font-medium",
								children: "Urutan tampil"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "urutan",
								type: "number",
								min: "0",
								value: data.urutan,
								onChange: (e) => setData("urutan", Number(e.target.value)),
								className: "mt-1 w-32 rounded border border-neutral-300 px-3 py-2"
							}),
							errors.urutan && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.urutan
							})
						] }),
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: data.show_on_landing,
								onChange: (e) => setData("show_on_landing", e.target.checked)
							}), "Tampilkan di landing page"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 pt-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: processing,
								className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50",
								children: processing ? "Menyimpan…" : "Simpan Perubahan"
							}), /* @__PURE__ */ jsx(Link, {
								href: "/admin/works",
								className: "text-sm text-neutral-500 underline",
								children: "Batal"
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/Admin/Works/Index.jsx
var Index_exports$1 = /* @__PURE__ */ __exportAll({ default: () => Index$1 });
function Index$1({ works }) {
	const [target, setTarget] = useState(null);
	function hapus() {
		router.delete(`/admin/works/${target.id}`, { onFinish: () => setTarget(null) });
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-4xl",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-3xl",
						children: "Works"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-neutral-500",
						children: "Kelola karya portofolio (1 work = 1 sesi/album)."
					})] }), /* @__PURE__ */ jsx(Link, {
						href: "/admin/works/create",
						className: "rounded bg-neutral-900 px-4 py-2 text-sm text-white",
						children: "+ Tambah Work"
					})]
				}),
				/* @__PURE__ */ jsxs("table", {
					className: "mt-6 w-full overflow-hidden rounded-lg bg-white text-sm shadow-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "border-b text-left text-neutral-500",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Judul"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Kategori"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Foto"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "Di Landing"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 text-right font-medium",
								children: "Aksi"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: works.map((work) => /* @__PURE__ */ jsxs("tr", {
						className: "border-b last:border-0",
						children: [
							/* @__PURE__ */ jsxs("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-medium",
									children: work.judul
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-xs text-neutral-400",
									children: ["/", work.slug]
								})]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: work.category.nama
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: work.photos_count
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: work.show_on_landing ? /* @__PURE__ */ jsx("span", {
									className: "rounded bg-green-100 px-2 py-1 text-xs text-green-700",
									children: "Ya"
								}) : /* @__PURE__ */ jsx("span", {
									className: "rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-500",
									children: "Tidak"
								})
							}),
							/* @__PURE__ */ jsxs("td", {
								className: "px-4 py-3 text-right",
								children: [
									/* @__PURE__ */ jsx(Link, {
										href: `/admin/works/${work.id}/photos`,
										className: "mr-3 text-neutral-900 underline",
										children: "Foto"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: `/admin/works/${work.id}/edit`,
										className: "mr-3 text-neutral-900 underline",
										children: "Ubah"
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => setTarget(work),
										className: "text-red-600 underline",
										children: "Hapus"
									})
								]
							})
						]
					}, work.id)) })]
				}),
				works.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "mt-6 text-center text-sm text-neutral-500",
					children: "Belum ada work. Tambahkan yang pertama."
				})
			]
		}), /* @__PURE__ */ jsx(ConfirmModal, {
			open: target !== null,
			judul: "Hapus Work",
			pesan: `Yakin ingin menghapus work "${target?.judul}"? Semua foto di dalamnya ikut terhapus.`,
			onConfirm: hapus,
			onClose: () => setTarget(null)
		})]
	});
}
//#endregion
//#region resources/js/Pages/Admin/Works/Photos.jsx
var Photos_exports = /* @__PURE__ */ __exportAll({ default: () => Photos });
var PERAN_LABEL = {
	cover: "Cover",
	landing_typography: "Landing — Tipografi",
	landing_strip: "Landing — Strip Horizontal",
	detail: "Detail (zig-zag)"
};
function Photos({ work }) {
	const { errors } = usePage().props;
	const [target, setTarget] = useState(null);
	const upload = useForm({ foto: [] });
	const drive = useForm({ gdrive_link: "" });
	function submitUpload(e) {
		e.preventDefault();
		upload.post(`/admin/works/${work.id}/photos`, {
			forceFormData: true,
			onSuccess: () => upload.reset()
		});
	}
	function submitDrive(e) {
		e.preventDefault();
		drive.post(`/admin/works/${work.id}/photos/drive`, { onSuccess: () => drive.reset() });
	}
	function ubahPeran(photo, peran) {
		router.patch(`/admin/photos/${photo.id}`, {
			peran,
			urutan: photo.urutan
		});
	}
	function ubahUrutan(photo, urutan) {
		router.patch(`/admin/photos/${photo.id}`, {
			peran: photo.peran,
			urutan: Number(urutan)
		});
	}
	function hapus() {
		router.delete(`/admin/photos/${target.id}`, { onFinish: () => setTarget(null) });
	}
	return /* @__PURE__ */ jsxs("main", {
		className: "min-h-screen bg-neutral-50 p-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-5xl",
			children: [
				/* @__PURE__ */ jsx(Link, {
					href: "/admin/works",
					className: "text-sm text-neutral-500 underline",
					children: "← Kembali ke Works"
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: "mt-2 font-serif text-3xl",
					children: ["Foto: ", work.judul]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-neutral-500",
					children: "Upload banyak foto sekaligus, atau tempel link Google Drive. Semua foto otomatis menjadi WebP + thumbnail."
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submitUpload,
					className: "mt-6 rounded-lg bg-white p-6 shadow-sm",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium",
							children: "Upload foto (bisa banyak, maks 20)"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "file",
							multiple: true,
							accept: "image/jpeg,image/png,image/webp",
							onChange: (e) => upload.setData("foto", Array.from(e.target.files)),
							className: "mt-2 block w-full text-sm"
						}),
						errors.foto && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600",
							children: errors.foto
						}),
						errors["foto.0"] && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600",
							children: errors["foto.0"]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: upload.processing || upload.data.foto.length === 0,
							className: "mt-4 rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50",
							children: upload.processing ? "Mengunggah…" : "Unggah"
						})
					]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submitDrive,
					className: "mt-4 rounded-lg bg-white p-6 shadow-sm",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium",
							children: "Atau tempel link Google Drive"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex gap-2",
							children: [/* @__PURE__ */ jsx("input", {
								type: "url",
								value: drive.data.gdrive_link,
								onChange: (e) => drive.setData("gdrive_link", e.target.value),
								placeholder: "https://drive.google.com/file/d/…",
								className: "w-full rounded border border-neutral-300 px-3 py-2 text-sm"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: drive.processing,
								className: "shrink-0 rounded border border-neutral-900 px-4 py-2 text-sm",
								children: drive.processing ? "Mengambil…" : "Ambil"
							})]
						}),
						errors.gdrive_link && /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-red-600",
							children: errors.gdrive_link
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-neutral-400",
							children: "File GD harus dibagikan \"Siapa saja yang memiliki link\". Sistem mengunduh sekali lalu menyimpannya lokal."
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-8 grid grid-cols-2 gap-4 md:grid-cols-4",
					children: work.photos.map((photo) => /* @__PURE__ */ jsxs("div", {
						className: "overflow-hidden rounded-lg bg-white shadow-sm",
						children: [/* @__PURE__ */ jsx("img", {
							src: `/storage/${photo.thumb_path ?? photo.file_path}`,
							alt: "",
							className: "aspect-square w-full object-cover",
							loading: "lazy"
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-2 p-3",
							children: [/* @__PURE__ */ jsx("select", {
								value: photo.peran,
								onChange: (e) => ubahPeran(photo, e.target.value),
								className: "w-full rounded border border-neutral-300 px-2 py-1 text-xs",
								children: Object.entries(PERAN_LABEL).map(([value, label]) => /* @__PURE__ */ jsx("option", {
									value,
									children: label
								}, value))
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "number",
									min: "0",
									defaultValue: photo.urutan,
									onBlur: (e) => ubahUrutan(photo, e.target.value),
									className: "w-16 rounded border border-neutral-300 px-2 py-1 text-xs",
									title: "Urutan tampil"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setTarget(photo),
									className: "text-xs text-red-600 underline",
									children: "Hapus"
								})]
							})]
						})]
					}, photo.id))
				}),
				work.photos.length === 0 && /* @__PURE__ */ jsx("p", {
					className: "mt-6 text-center text-sm text-neutral-500",
					children: "Belum ada foto di work ini."
				})
			]
		}), /* @__PURE__ */ jsx(ConfirmModal, {
			open: target !== null,
			judul: "Hapus Foto",
			pesan: "Yakin ingin menghapus foto ini? File fisiknya juga dihapus dari server.",
			onConfirm: hapus,
			onClose: () => setTarget(null)
		})]
	});
}
//#endregion
//#region resources/js/Pages/Auth/Login.jsx
var Login_exports = /* @__PURE__ */ __exportAll({ default: () => Login });
function Login() {
	const { data, setData, post, processing, errors } = useForm({
		email: "",
		password: "",
		remember: false
	});
	function submit(e) {
		e.preventDefault();
		post("/login");
	}
	return /* @__PURE__ */ jsx("main", {
		className: "flex min-h-screen items-center justify-center bg-neutral-50",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-sm rounded-lg bg-white p-8 shadow-sm",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "font-serif text-3xl",
					children: "Masuk Admin"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-neutral-500",
					children: "DzarProject"
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "email",
								className: "block text-sm font-medium",
								children: "Email"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "email",
								type: "email",
								value: data.email,
								onChange: (e) => setData("email", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2",
								autoFocus: true
							}),
							errors.email && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.email
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								htmlFor: "password",
								className: "block text-sm font-medium",
								children: "Kata Sandi"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "password",
								type: "password",
								value: data.password,
								onChange: (e) => setData("password", e.target.value),
								className: "mt-1 w-full rounded border border-neutral-300 px-3 py-2"
							}),
							errors.password && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-red-600",
								children: errors.password
							})
						] }),
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: data.remember,
								onChange: (e) => setData("remember", e.target.checked)
							}), "Ingat saya"]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "w-full rounded bg-neutral-900 py-2 text-white disabled:opacity-50",
							children: processing ? "Memproses…" : "Masuk"
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Components/Landing/EditorialStrip.jsx
function EditorialStrip({ photos = [] }) {
	const wrapRef = useRef(null);
	const trackRef = useRef(null);
	const [progres, setProgres] = useState(0);
	const [geser, setGeser] = useState(0);
	useEffect(() => {
		function ukur() {
			if (trackRef.current) setGeser(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
		}
		ukur();
		window.addEventListener("resize", ukur);
		return () => window.removeEventListener("resize", ukur);
	}, [photos]);
	useEffect(() => {
		function onScroll() {
			const el = wrapRef.current;
			if (!el) return;
			const total = el.offsetHeight - window.innerHeight;
			const p = total > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)) : 0;
			setProgres(p);
		}
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	if (photos.length === 0) return null;
	const kelasFoto = (i) => [
		"h-[60vh] w-[40vw]",
		"h-[75vh] w-[30vw]",
		"h-[50vh] w-[35vw]"
	][i % 3];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("section", {
		ref: wrapRef,
		className: "relative hidden bg-white md:block",
		style: { height: "320vh" },
		children: /* @__PURE__ */ jsx("div", {
			className: "sticky top-0 flex h-screen items-center overflow-hidden",
			children: /* @__PURE__ */ jsx("div", {
				ref: trackRef,
				className: "flex items-center gap-10 px-[10vw] will-change-transform",
				style: { transform: `translateX(-${progres * geser}px)` },
				children: photos.map((photo, i) => /* @__PURE__ */ jsxs(Link, {
					href: `/works/${photo.work_slug}`,
					className: "group shrink-0",
					children: [/* @__PURE__ */ jsx("img", {
						src: photo.url,
						alt: photo.work_judul,
						loading: "lazy",
						className: `rounded-sm object-cover transition duration-500 group-hover:opacity-90 ${kelasFoto(i)}`
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-xs tracking-[0.25em] text-neutral-500 uppercase",
						children: photo.work_judul
					})]
				}, photo.id))
			})
		})
	}), /* @__PURE__ */ jsx("section", {
		className: "overflow-x-auto bg-white py-10 md:hidden",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex snap-x snap-mandatory gap-4 px-4",
			children: photos.map((photo) => /* @__PURE__ */ jsxs(Link, {
				href: `/works/${photo.work_slug}`,
				className: "w-4/5 shrink-0 snap-center",
				children: [/* @__PURE__ */ jsx("img", {
					src: photo.url,
					alt: photo.work_judul,
					loading: "lazy",
					className: "aspect-[3/4] w-full rounded-sm object-cover"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-xs tracking-[0.25em] text-neutral-500 uppercase",
					children: photo.work_judul
				})]
			}, photo.id))
		})
	})] });
}
//#endregion
//#region resources/js/Components/Landing/HeroSlideshow.jsx
function HeroSlideshow({ photos = [] }) {
	const [aktif, setAktif] = useState(0);
	useEffect(() => {
		if (photos.length < 2) return;
		const timer = setInterval(() => setAktif((i) => (i + 1) % photos.length), 5e3);
		return () => clearInterval(timer);
	}, [photos.length]);
	if (photos.length === 0) return /* @__PURE__ */ jsx("section", {
		className: "flex h-screen items-center justify-center bg-neutral-900 text-white",
		children: /* @__PURE__ */ jsx("h1", {
			className: "font-serif text-5xl",
			children: "DzarProject"
		})
	});
	const geser = (arah) => setAktif((i) => (i + arah + photos.length) % photos.length);
	return /* @__PURE__ */ jsxs("section", {
		className: "relative h-screen overflow-hidden bg-neutral-900",
		children: [
			photos.map((photo, i) => /* @__PURE__ */ jsx("img", {
				src: photo.url,
				alt: photo.work_judul,
				loading: i === 0 ? "eager" : "lazy",
				className: `absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === aktif ? "opacity-100" : "opacity-0"}`
			}, photo.id)),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/30" }),
			/* @__PURE__ */ jsxs("div", {
				className: "absolute bottom-10 left-6 text-white md:left-10",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "text-sm tracking-[0.4em]",
						children: [
							String(aktif + 1).padStart(2, "0"),
							" / ",
							String(photos.length).padStart(2, "0")
						]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-2 font-serif text-5xl md:text-6xl",
						children: "DzarProject"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-neutral-200",
						children: photos[aktif].work_judul
					})
				]
			}),
			photos.length > 1 && /* @__PURE__ */ jsxs("div", {
				className: "absolute right-6 bottom-10 flex gap-3 md:right-10",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => geser(-1),
					"aria-label": "Foto sebelumnya",
					className: "rounded-full border border-white/60 px-4 py-2 text-white transition hover:bg-white hover:text-black",
					children: "←"
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => geser(1),
					"aria-label": "Foto berikutnya",
					className: "rounded-full border border-white/60 px-4 py-2 text-white transition hover:bg-white hover:text-black",
					children: "→"
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Landing/StatementTypography.jsx
function StatementTypography({ photos = [] }) {
	const foto = photos[0];
	if (!foto) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "relative overflow-hidden bg-neutral-50 py-28",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-serif text-[22vw] leading-none text-neutral-900/5 select-none",
			children: "DZAR"
		}), /* @__PURE__ */ jsx("div", {
			className: "relative mx-auto max-w-3xl px-6",
			children: /* @__PURE__ */ jsxs(Link, {
				href: `/works/${foto.work_slug}`,
				className: "group block",
				children: [/* @__PURE__ */ jsx("img", {
					src: foto.url,
					alt: foto.work_judul,
					loading: "lazy",
					className: "w-full rounded-sm object-cover shadow-xl transition duration-500 group-hover:scale-[1.02]"
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-4 text-center text-sm tracking-[0.3em] text-neutral-500 uppercase",
					children: [foto.work_judul, " — Lihat Karya"]
				})]
			})
		})]
	});
}
//#endregion
//#region resources/js/Layouts/PublicLayout.jsx
function PublicLayout({ children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-neutral-50 font-sans text-neutral-900",
		children: [
			/* @__PURE__ */ jsx("header", {
				className: "fixed inset-x-0 top-0 z-40 mix-blend-difference",
				children: /* @__PURE__ */ jsxs("nav", {
					className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-white",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/",
						className: "font-serif text-xl tracking-[0.3em]",
						children: "DZARPROJECT"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-6 text-xs tracking-widest uppercase md:gap-8",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/",
								children: "Home"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/#tentang",
								children: "About"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/works",
								children: "Works"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/#kontak",
								children: "Contact"
							})
						]
					})]
				})
			}),
			children,
			/* @__PURE__ */ jsx("footer", {
				className: "bg-neutral-900 py-10 text-center text-sm text-neutral-400",
				children: /* @__PURE__ */ jsxs("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" DzarProject. Seluruh karya dilindungi."
				] })
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Landing/KontakForm.jsx
function KontakForm() {
	const { flash } = usePage().props;
	const { data, setData, post, processing, errors, reset } = useForm({
		nama: "",
		email: "",
		no_wa: "",
		pesan: "",
		alamat_web: ""
	});
	useEffect(() => {
		if (flash?.wa_url) {
			window.open(flash.wa_url, "_blank");
			reset();
		}
	}, [flash?.wa_url]);
	function submit(e) {
		e.preventDefault();
		post("/kontak", { preserveScroll: true });
	}
	const inputKelas = "mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-neutral-500 focus:border-white/60 focus:outline-none";
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: submit,
		className: "mt-10 space-y-4 text-left",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("label", {
					htmlFor: "nama",
					className: "block text-sm",
					children: "Nama"
				}),
				/* @__PURE__ */ jsx("input", {
					id: "nama",
					type: "text",
					value: data.nama,
					onChange: (e) => setData("nama", e.target.value),
					className: inputKelas,
					placeholder: "Nama kamu"
				}),
				errors.nama && /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-red-400",
					children: errors.nama
				})
			] }),
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("label", {
					htmlFor: "email",
					className: "block text-sm",
					children: "Email"
				}),
				/* @__PURE__ */ jsx("input", {
					id: "email",
					type: "email",
					value: data.email,
					onChange: (e) => setData("email", e.target.value),
					className: inputKelas,
					placeholder: "nama@email.com"
				}),
				errors.email && /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-red-400",
					children: errors.email
				})
			] }),
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("label", {
					htmlFor: "no_wa",
					className: "block text-sm",
					children: "No. WhatsApp"
				}),
				/* @__PURE__ */ jsx("input", {
					id: "no_wa",
					type: "text",
					value: data.no_wa,
					onChange: (e) => setData("no_wa", e.target.value),
					className: inputKelas,
					placeholder: "08xxxxxxxxxx"
				}),
				errors.no_wa && /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-red-400",
					children: errors.no_wa
				})
			] }),
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("label", {
					htmlFor: "pesan",
					className: "block text-sm",
					children: "Pesan"
				}),
				/* @__PURE__ */ jsx("textarea", {
					id: "pesan",
					rows: "4",
					value: data.pesan,
					onChange: (e) => setData("pesan", e.target.value),
					className: inputKelas,
					placeholder: "Ceritakan kebutuhan fotomu…"
				}),
				errors.pesan && /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-red-400",
					children: errors.pesan
				})
			] }),
			/* @__PURE__ */ jsxs("div", {
				className: "hidden",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ jsx("label", {
					htmlFor: "alamat_web",
					children: "Alamat Website"
				}), /* @__PURE__ */ jsx("input", {
					id: "alamat_web",
					type: "text",
					value: data.alamat_web,
					onChange: (e) => setData("alamat_web", e.target.value),
					tabIndex: -1,
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ jsx("button", {
				type: "submit",
				disabled: processing,
				className: "w-full rounded bg-white py-3 text-sm font-medium tracking-widest text-neutral-900 uppercase transition hover:bg-neutral-200 disabled:opacity-50",
				children: processing ? "Memproses…" : "Get in Touch"
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Home.jsx
var Home_exports = /* @__PURE__ */ __exportAll({ default: () => Home });
var PAKET = [
	{
		nama: "Essential",
		harga: "Rp 1.500.000",
		fitur: [
			"1 jam sesi foto",
			"15 foto edit",
			"File digital via link"
		]
	},
	{
		nama: "Signature",
		harga: "Rp 3.000.000",
		fitur: [
			"3 jam sesi foto",
			"40 foto edit",
			"Cetak 10 foto 4R",
			"File digital via link"
		]
	},
	{
		nama: "Legacy",
		harga: "Rp 6.000.000",
		fitur: [
			"Sesi seharian penuh",
			"100+ foto edit",
			"Album cetak premium",
			"File digital via link"
		]
	}
];
function Home({ heroPhotos, tipografiPhotos, stripPhotos, videos }) {
	return /* @__PURE__ */ jsxs(PublicLayout, { children: [
		/* @__PURE__ */ jsxs(Head, { children: [
			/* @__PURE__ */ jsx("title", { children: "Portofolio Fotografi — DzarProject" }),
			/* @__PURE__ */ jsx("meta", {
				name: "description",
				content: "DzarProject — portofolio fotografi wedding, prewedding, lamaran, dan wisuda. Lihat karya terbaik kami."
			}),
			/* @__PURE__ */ jsx("meta", {
				property: "og:title",
				content: "DzarProject — Portofolio Fotografi"
			}),
			/* @__PURE__ */ jsx("meta", {
				property: "og:description",
				content: "Portofolio fotografi wedding, prewedding, lamaran, dan wisuda."
			})
		] }),
		/* @__PURE__ */ jsx(HeroSlideshow, { photos: heroPhotos }),
		/* @__PURE__ */ jsx(StatementTypography, { photos: tipografiPhotos }),
		/* @__PURE__ */ jsx(EditorialStrip, { photos: stripPhotos }),
		videos.length > 0 && /* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-5xl px-6 py-24",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "font-serif text-4xl",
				children: "Videos"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-8 grid gap-8 md:grid-cols-2",
				children: videos.map((video) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "aspect-video overflow-hidden rounded-sm bg-black",
					children: /* @__PURE__ */ jsx("iframe", {
						src: video.embed_url,
						title: video.judul || "Video",
						className: "h-full w-full",
						loading: "lazy",
						allowFullScreen: true
					})
				}), video.judul && /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-neutral-500",
					children: video.judul
				})] }, video.id))
			})]
		}),
		/* @__PURE__ */ jsx("section", {
			className: "bg-neutral-100 py-24",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-5xl px-6",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-center font-serif text-4xl",
						children: "Paket & Harga"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-10 grid gap-6 md:grid-cols-3",
						children: PAKET.map((paket) => /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg bg-white p-8 text-center shadow-sm",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-serif text-2xl",
									children: paket.nama
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-xl",
									children: paket.harga
								}),
								/* @__PURE__ */ jsx("ul", {
									className: "mt-4 space-y-2 text-sm text-neutral-500",
									children: paket.fitur.map((f) => /* @__PURE__ */ jsx("li", { children: f }, f))
								})
							]
						}, paket.nama))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 text-center text-xs text-neutral-400",
						children: "Harga contoh — ubah di resources/js/Pages/Home.jsx (konten statis sesuai PRD)."
					})
				]
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			id: "tentang",
			className: "mx-auto max-w-3xl px-6 py-24 text-center",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "font-serif text-4xl",
				children: "Tentang"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-6 leading-relaxed text-neutral-600",
				children: "DzarProject adalah studio fotografi yang percaya setiap momen layak diabadikan dengan cara yang jujur dan indah — dari wedding, prewedding, lamaran, hingga wisuda."
			})]
		}),
		/* @__PURE__ */ jsx("section", {
			id: "kontak",
			className: "bg-neutral-900 py-24 text-white",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-xl px-6",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-center font-serif text-4xl",
						children: "Mari Bekerja Sama"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 text-center text-neutral-400",
						children: "Ceritakan kebutuhan fotomu — pesanmu langsung diteruskan ke WhatsApp kami."
					}),
					/* @__PURE__ */ jsx(KontakForm, {})
				]
			})
		})
	] });
}
//#endregion
//#region resources/js/Pages/Works/Index.jsx
var Index_exports = /* @__PURE__ */ __exportAll({ default: () => Index });
var pill = (aktif) => `rounded-full border px-4 py-1.5 text-sm transition ${aktif ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:border-neutral-900"}`;
function Index({ works, categories, kategoriAktif }) {
	return /* @__PURE__ */ jsxs(PublicLayout, { children: [/* @__PURE__ */ jsxs(Head, { children: [/* @__PURE__ */ jsx("title", { children: "Works — DzarProject" }), /* @__PURE__ */ jsx("meta", {
		name: "description",
		content: "Jelajahi semua karya fotografi DzarProject: wedding, prewedding, lamaran, wisuda."
	})] }), /* @__PURE__ */ jsxs("section", {
		className: "mx-auto max-w-6xl px-6 pt-32 pb-24",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-serif text-5xl",
				children: "Works"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-neutral-500",
				children: "Kumpulan karya DzarProject — klik untuk melihat cerita lengkapnya."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ jsx(Link, {
					href: "/works",
					className: pill(!kategoriAktif),
					children: "Semua"
				}), categories.map((c) => /* @__PURE__ */ jsx(Link, {
					href: `/works?kategori=${c.slug}`,
					className: pill(kategoriAktif === c.slug),
					children: c.nama
				}, c.id))]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-10 grid grid-cols-2 gap-6 md:grid-cols-3",
				children: works.map((work) => /* @__PURE__ */ jsxs(Link, {
					href: `/works/${work.slug}`,
					className: "group",
					children: [/* @__PURE__ */ jsx("div", {
						className: "overflow-hidden rounded-sm bg-neutral-200",
						children: work.cover ? /* @__PURE__ */ jsx("img", {
							src: work.cover,
							alt: work.judul,
							loading: "lazy",
							className: "aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
						}) : /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] w-full" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex items-baseline justify-between",
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-medium",
							children: work.judul
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs tracking-widest text-neutral-400 uppercase",
							children: work.kategori
						})]
					})]
				}, work.slug))
			}),
			works.length === 0 && /* @__PURE__ */ jsx("p", {
				className: "mt-16 text-center text-neutral-500",
				children: "Belum ada karya pada kategori ini."
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Works/Show.jsx
var Show_exports = /* @__PURE__ */ __exportAll({ default: () => Show });
function Show({ work, sebelumnya, berikutnya }) {
	return /* @__PURE__ */ jsxs(PublicLayout, { children: [
		/* @__PURE__ */ jsxs(Head, { children: [
			/* @__PURE__ */ jsx("title", { children: `${work.judul} — DzarProject` }),
			/* @__PURE__ */ jsx("meta", {
				name: "description",
				content: work.deskripsi || `Karya ${work.kategori} oleh DzarProject: ${work.judul}.`
			}),
			work.cover_url && /* @__PURE__ */ jsx("meta", {
				property: "og:image",
				content: work.cover_url
			})
		] }),
		/* @__PURE__ */ jsxs("section", {
			className: "relative flex h-[80vh] items-end bg-neutral-900",
			children: [
				work.cover_url && /* @__PURE__ */ jsx("img", {
					src: work.cover_url,
					alt: work.judul,
					className: "absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40" }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative mx-auto w-full max-w-5xl px-6 pb-12 text-white",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "text-xs tracking-[0.3em] uppercase",
						children: [work.kategori, work.lokasi ? ` — ${work.lokasi}` : ""]
					}), /* @__PURE__ */ jsx("h1", {
						className: "mt-2 font-serif text-5xl md:text-7xl",
						children: work.judul
					})]
				})
			]
		}),
		work.deskripsi && /* @__PURE__ */ jsx("section", {
			className: "mx-auto max-w-3xl px-6 py-16 text-center",
			children: /* @__PURE__ */ jsx("p", {
				className: "leading-relaxed text-neutral-600",
				children: work.deskripsi
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mx-auto max-w-6xl space-y-8 px-6 pb-16 md:space-y-16",
			children: work.fotos.map((photo, i) => {
				const penuh = i % 5 === 3;
				const kiri = i % 2 === 0;
				return /* @__PURE__ */ jsx("img", {
					src: photo.url,
					alt: `${work.judul} — foto ${i + 1}`,
					loading: "lazy",
					className: penuh ? "w-full rounded-sm" : `rounded-sm md:w-2/3 ${kiri ? "md:mr-auto" : "md:ml-auto"}`
				}, photo.id);
			})
		}),
		work.embed_url && /* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-4xl px-6 pb-24",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "mb-6 text-center font-serif text-3xl",
				children: "Film"
			}), /* @__PURE__ */ jsx("div", {
				className: "aspect-video overflow-hidden rounded-sm bg-black",
				children: /* @__PURE__ */ jsx("iframe", {
					src: work.embed_url,
					title: `Film ${work.judul}`,
					className: "h-full w-full",
					loading: "lazy",
					allowFullScreen: true
				})
			})]
		}),
		/* @__PURE__ */ jsxs("nav", {
			className: "mx-auto flex max-w-6xl items-center justify-between border-t px-6 py-8 text-sm",
			children: [
				sebelumnya ? /* @__PURE__ */ jsxs(Link, {
					href: `/works/${sebelumnya.slug}`,
					className: "hover:underline",
					children: ["← ", sebelumnya.judul]
				}) : /* @__PURE__ */ jsx("span", {}),
				/* @__PURE__ */ jsx(Link, {
					href: "/works",
					className: "text-neutral-500 hover:underline",
					children: "Semua Karya"
				}),
				berikutnya ? /* @__PURE__ */ jsxs(Link, {
					href: `/works/${berikutnya.slug}`,
					className: "hover:underline",
					children: [berikutnya.judul, " →"]
				}) : /* @__PURE__ */ jsx("span", {})
			]
		})
	] });
}
//#endregion
//#region resources/js/ssr.jsx
createServer((page) => createInertiaApp({
	page,
	render: ReactDOMServer.renderToString,
	resolve: (name) => {
		return (/* @__PURE__ */ Object.assign({
			"./Pages/Admin/Categories/Create.jsx": Create_exports$2,
			"./Pages/Admin/Categories/Edit.jsx": Edit_exports$2,
			"./Pages/Admin/Categories/Index.jsx": Index_exports$3,
			"./Pages/Admin/Dashboard.jsx": Dashboard_exports,
			"./Pages/Admin/Videos/Create.jsx": Create_exports$1,
			"./Pages/Admin/Videos/Edit.jsx": Edit_exports$1,
			"./Pages/Admin/Videos/Index.jsx": Index_exports$2,
			"./Pages/Admin/Works/Create.jsx": Create_exports,
			"./Pages/Admin/Works/Edit.jsx": Edit_exports,
			"./Pages/Admin/Works/Index.jsx": Index_exports$1,
			"./Pages/Admin/Works/Photos.jsx": Photos_exports,
			"./Pages/Auth/Login.jsx": Login_exports,
			"./Pages/Home.jsx": Home_exports,
			"./Pages/Works/Index.jsx": Index_exports,
			"./Pages/Works/Show.jsx": Show_exports
		}))[`./Pages/${name}.jsx`];
	},
	setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
}));
//#endregion
export {};
