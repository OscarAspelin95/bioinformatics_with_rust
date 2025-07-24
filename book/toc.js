// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="prefix/0_todo_list.html">TODO list</a></li><li class="chapter-item expanded affix "><a href="prefix/1_introduction.html">Introduction</a></li><li class="chapter-item expanded affix "><a href="prefix/2_why_rust.html">Why Rust?</a></li><li class="chapter-item expanded affix "><a href="prefix/3_prerequisites.html">Prerequisites</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="main/getting_started/getting_started.html"><strong aria-hidden="true">1.</strong> Getting Started</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="main/nucleotides/1_nucleotides.html"><strong aria-hidden="true">2.</strong> Nucleotides</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="main/nucleotides/2_create_nucleotide_sequence.html"><strong aria-hidden="true">2.1.</strong> Create A Nucleotide Sequence</a></li><li class="chapter-item expanded "><a href="main/nucleotides/3_count_nucleotides.html"><strong aria-hidden="true">2.2.</strong> Counting Nucleotides</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="main/nucleotides/3_1_gc_content.html"><strong aria-hidden="true">2.2.1.</strong> GC content</a></li></ol></li><li class="chapter-item expanded "><a href="main/nucleotides/4_reverse_complement.html"><strong aria-hidden="true">2.3.</strong> Reverse Complement</a></li><li class="chapter-item expanded "><a href="main/nucleotides/5_nucleotide_encoding.html"><strong aria-hidden="true">2.4.</strong> Encoding</a></li></ol></li><li class="chapter-item expanded "><li class="spacer"></li><li class="chapter-item expanded "><a href="main/alignment/1_basics_of_alignment.html"><strong aria-hidden="true">3.</strong> The Basics Of Alignment</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="main/alignment/2_hamming_distance.html"><strong aria-hidden="true">3.1.</strong> Hamming Distance</a></li><li class="chapter-item expanded "><a href="main/alignment/3_edit_distance.html"><strong aria-hidden="true">3.2.</strong> Edit Distance</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="main/alignment/3_1_adding_traceback.html"><strong aria-hidden="true">3.2.1.</strong> Adding Traceback</a></li></ol></li><li class="chapter-item expanded "><a href="main/alignment/4_smith_waterman.html"><strong aria-hidden="true">3.3.</strong> Smith-Waterman algorithm</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="main/alignment/4_1_desktop_app.html"><strong aria-hidden="true">3.3.1.</strong> Creating a desktop app</a></li></ol></li><li class="chapter-item expanded "><a href="main/alignment/resources.html"><strong aria-hidden="true">3.4.</strong> Resources</a></li></ol></li><li class="chapter-item expanded "><li class="spacer"></li><li class="chapter-item expanded "><a href="main/kmers/1_kmers.html"><strong aria-hidden="true">4.</strong> Kmers</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="main/kmers/2_naive_implementation.html"><strong aria-hidden="true">4.1.</strong> Naive Implementation</a></li><li class="chapter-item expanded "><a href="main/kmers/3_bit_shift_encoding.html"><strong aria-hidden="true">4.2.</strong> Bit Shift Encoding</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="main/kmers/3_1_forward_strand.html"><strong aria-hidden="true">4.2.1.</strong> Forward Strand</a></li><li class="chapter-item expanded "><a href="main/kmers/3_2_reverse_strand.html"><strong aria-hidden="true">4.2.2.</strong> Reverse Strand</a></li><li class="chapter-item expanded "><a href="main/kmers/3_3_final_implementation.html"><strong aria-hidden="true">4.2.3.</strong> Final Implementation</a></li></ol></li><li class="chapter-item expanded "><a href="main/kmers/4_simd_vectorization.html"><strong aria-hidden="true">4.3.</strong> SIMD Vectorization</a></li><li class="chapter-item expanded "><a href="main/kmers/5_min_frac_hash.html"><strong aria-hidden="true">4.4.</strong> FracMinHash</a></li><li class="chapter-item expanded "><a href="main/kmers/6_making_something_useful.html"><strong aria-hidden="true">4.5.</strong> Making something useful</a></li><li class="chapter-item expanded "><a href="main/kmers/7_minimizers.html"><strong aria-hidden="true">4.6.</strong> Minimizers</a></li></ol></li><li class="chapter-item expanded "><li class="spacer"></li><li class="chapter-item expanded "><a href="suffix/1_resources.html"><strong aria-hidden="true">5.</strong> Resources</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="suffix/2_awesome_rust_crates.html"><strong aria-hidden="true">5.1.</strong> Awesome Rust Crates</a></li><li class="chapter-item expanded "><a href="suffix/3_awesome_bioinformatic_tools.html"><strong aria-hidden="true">5.2.</strong> Awesome Bioinformatic Tools</a></li></ol></li><li class="chapter-item expanded "><li class="spacer"></li><li class="chapter-item expanded "><a href="suffix/4_thank_you.html"><strong aria-hidden="true">6.</strong> Thank You</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
