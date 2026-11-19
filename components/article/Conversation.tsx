"use client";

import { asset } from "@/lib/asset";
import { r, BANDS, COLORS, fullBleed } from "@/lib/px";
import { Band, Reveal, RevealImg, DrawLine } from "@/components/article/anim";
import { useIsMobile } from "@/components/useIsMobile";
import { useState, useEffect, FormEvent, CSSProperties } from "react";
import { DateTime } from "luxon";
import Link from 'next/link';
import { EDITORIAL_ARTICLES, MONDAY_FORM, GCard } from '@/lib/constants';

const A = (p: string) => asset(`/assets/${p}`);
const O = BANDS.conversation.offset; // 2408
const top = (y: number) => r(y - O);

// Always shown first in related articles.
const FEATURED_RELATED: GCard[] = [
  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "The Australian consumer is in better shape than the mood in most boardrooms suggests, but the gap between retail winners and losers is set to widen. ",
    title:
      "The great retail decoupling",
    href: "/article/the-great-retail-decoupling/",
    image: "retail-decoupling-tile.jpeg",
  },
  {
    kind: "tall",
    left: 0,
    top: 0,
    blurb:
      "For years, retail rewarded those who moved fastest. Now it favours those who understand what they actually own. ",
    caption: "Industry Persectives",
    title: "ANZ retail media state of play 2026",
    href: "/article/retail-media/",
    image: "retail-media-tile.jpg",
  },
  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "Birdeye’s Tony Van-Eyk on AI visibility, reviews and where retail leaders should start",
    caption: "From Tools to Agents",
    title: "The state of AI in retail",
    href: "/article/from-tools-to-agents",
    image: "state-of-ai-tile.jpg",
  },
];

const LINE_LIGHT = "rgba(11,11,43,0.14)";
const LINE_NAVY = "rgba(255,255,255,0.22)";

// A white right-arrow inside a purple submit circle (email capture buttons).
function PurpleArrow({ size }: { size?: number }) {
  const isMobile = useIsMobile();
  const finalSize = isMobile ? 60 : size || 39;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: r(finalSize),
        height: r(finalSize),
        borderRadius: "50%",
        background: COLORS.purple,
        flexShrink: 0,
      }}
    >
      <svg width={r(isMobile ? 28.5 : 19)} height={r(isMobile ? 18 : 12)} viewBox="0 0 19 12" fill="none">
        <path d="M0.5 6h17M13 1l5 5-5 5" stroke="#fff" strokeWidth={isMobile ? 2 : 1.4} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Comment({
  avatar,
  name,
  date,
  likes,
  body,
  delay,
}: {
  avatar: string;
  name: string;
  date: string;
  likes: number;
  body: string;
  delay: number;
}) {
  const isMobile = useIsMobile();

  return (
    <Reveal delay={delay} style={{ width: isMobile ? "100%" : r(648) }}>
      <div style={{ display: "flex", gap: isMobile ? r(30) : r(16), alignItems: "flex-start" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt="" style={{ width: r(isMobile ? 80 : 50), height: r(isMobile ? 80 : 50), borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? r(24) : r(16), width: isMobile ? "100%" : r(581) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? r(40) : r(37) }}>
              <span className="font-inter" style={{ fontSize: isMobile ? r(30) : r(16), letterSpacing: r(0.32), color: COLORS.black }}>{name}</span>
              <span className="font-inter" style={{ fontSize: isMobile ? r(28) : r(12), letterSpacing: r(0.24), color: COLORS.black }}>{date}</span>
            </div>
            {/* <div style={{ display: "flex", alignItems: "center", gap: r(8) }}>
              <img src={A("icon-heart.svg")} alt="" style={{ width: r(isMobile ? 32 : 16), height: r(isMobile ? 28 : 14) }} />
              <span className="font-inter" style={{ fontSize: isMobile ? r(30) : r(12), letterSpacing: r(0.24), color: COLORS.black }}>{likes}</span>
            </div> */}
          </div>
          <p className="font-inter" style={{ fontSize: isMobile ? r(30) : r(14), lineHeight: isMobile ? r(40) : r(24), letterSpacing: r(0.28), color: COLORS.black, width: isMobile ? "100%" : r(501) }}>{body}</p>
          {/* <span className="font-inter" style={{ fontSize: isMobile ? r(30) : r(12), letterSpacing: r(0.24), color: COLORS.black }}>REPLY</span> */}
        </div>
      </div>
    </Reveal>
  );
}

function RelatedCard({ img, delay, title, href }: { img: string; delay: number, title?: string, href?: string }) {
  const isMobile = useIsMobile();
  return (
    <Link href={href || "#"}>
      <RevealImg
        delay={delay}
        className="card-img"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: isMobile ? "1 / 1" : "200 / 228",
          color: title?.toLowerCase().includes("diplomat")
          ? COLORS.black
          : COLORS.white,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: isMobile ? `top top` : undefined }} />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(11, 11, 43, 0.8) 0%, rgba(11, 11, 43, 0) 60%)",
          }}
        />
        <Reveal delay={delay + 0.08} style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: r(16) }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: isMobile ? r(30) : r(20), padding: isMobile ? `${r(40)} ${r(40)}` : "0" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: r(8) }}>
              <p
                className="font-ivy"
                style={{ 
                  fontSize: isMobile ? r(70) : r(22), 
                  lineHeight: isMobile ? "100%" : "100%", 
                  letterSpacing: r(-0.6), 
                  margin: 0, 
                  width: isMobile ? r(500) : "100%", 
                  ...({ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 4, overflow: "hidden", textOverflow: "ellipsis" }) }}
              >
                {title}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="arrow"
              src={A("arrow-card.svg")}
              alt=""
              style={{
              width: isMobile ? r(60) : r(16),
              height: isMobile ? r(30) : r(9),
              filter: title?.toLowerCase().includes("diplomat")
                ? "none"
                : "invert(1)",
            }}
            />
          </div>
        </Reveal>
      </RevealImg>
    </Link>
  );
}

// A 46px bordered circle holding a social glyph.
function Social({ src }: { src: string }) {
  const isMobile = useIsMobile();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title);
  }, []);

  const socialTypeMatch = src.match(/social-(\d)\.svg/);
  const socialType = socialTypeMatch ? socialTypeMatch[1] : null;

  let shareUrl = '#';
  let altText = 'Share';
  let target = '_blank';
  let onClick;

  switch (socialType) {
    case "2": // Assuming Facebook
      shareUrl = url ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` : '#';
      altText = "Share on Facebook";
      break;
    case "4": // Assuming Twitter
      shareUrl = url ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` : '#';
      altText = "Share on Twitter";
      break;
    case "1": // Assuming LinkedIn
      shareUrl = url ? `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` : '#';
      altText = "Share on LinkedIn";
      break;
    case "5": // Assuming Email
      shareUrl = url ? `mailto:?subject=${encodeURIComponent(title)}&body=Check out this article: ${encodeURIComponent(url)}` : '#';
      altText = "Share via Email";
      target = '_self';
      break;
    case "6": // Copy Link
      altText = "Copy link";
      target = '_self';
      onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (url) {
          navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard!");
          }).catch(err => {
            console.error('Failed to copy link: ', err);
          });
        }
      };
      break;
    case "3": // Assuming Instagram - link to profile
      shareUrl = "https://www.instagram.com/nora_network/";
      altText = "NORA Network on Instagram";
      break;
  }

  return (
    <a
      href={shareUrl}
      target={target}
      rel="noopener noreferrer"
      onClick={onClick}
      title={altText}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: r(isMobile ? 150 : 46),
        height: r(isMobile ? 150 : 46),
        borderRadius: "50%",
        border: `${r(isMobile ? 1.2 : 0.605)} solid ${COLORS.white}`,
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={altText} style={{ width: r(isMobile ? 70 : 20), height: r(isMobile ? 70 : 20), objectFit: "contain" }} />
    </a>
  );
}

// Add a type for the comment structure
type CommentData = {
  id: number;
  author_avatar_urls: { [key: string]: string };
  author_name: string;
  date: string;
  content: { rendered: string };
  likes?: number; // Optional as it might be custom meta
};

// Type for user details in local storage
type UserDetails = {
  name: string;
  email: string;
  expiry: number;
};

// Conversation — band 3 (node 183:5). White + paper texture on the left (comments,
// related articles) and a navy sidebar on the right (author, share, newsletter).
export function Conversation({
  author,
  articleId,
  limitRelated
}: {
  author?: { name?: string; bio?: string; avatar?: string };
  articleId?: number;
  limitRelated?: Boolean;
}) {
  const isMobile = useIsMobile();
  const API_URL = 'https://wordpress.thenoraedit.com.au/wp-json/wp/v2/';

  // State for comments, loading, and new comment form
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postId, setPostId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<typeof EDITORIAL_ARTICLES>([]);

  const popupStyles: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  };

  const popupContentStyles: CSSProperties = {
    position: 'relative',
    width: '80%',
    maxWidth: '800px',
    height: '80%',
    background: 'white',
    padding: isMobile ? r(20) : '20px',
    borderRadius: '8px',
    boxSizing: 'border-box',
  };

  const closeButtonStyles: CSSProperties = {
    position: 'absolute',
    top: isMobile ? r(20) : '10px',
    right: isMobile ? r(20) : '10px',
    background: 'transparent',
    border: 'none',
    fontSize: isMobile ? r(60) : '24px',
    cursor: 'pointer',
    color: '#333',
    lineHeight: 1,
    padding: 0,
  };

  const iframeStyles: CSSProperties = {
    width: '100%',
    height: '100%',
  };

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("nora_comment_user");
    if (storedUserDetails) {
      try {
        const userDetails: UserDetails = JSON.parse(storedUserDetails);
        if (new Date().getTime() < userDetails.expiry) {
          setAuthorName(userDetails.name);
          setAuthorEmail(userDetails.email);
        } else {
          localStorage.removeItem("nora_comment_user");
        }
      } catch (e) {
        console.error("Failed to parse user details from local storage", e);
        localStorage.removeItem("nora_comment_user");
      }
    }

    const fetchPostAndComments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedPostId = articleId || null;

        if (fetchedPostId) {
          setPostId(fetchedPostId);

          const commentsResponse = await fetch(`${API_URL}comments?post=${fetchedPostId}`);
          if (!commentsResponse.ok) {
            throw new Error("Failed to fetch comments");
          }
          const data = await commentsResponse.json();
          setComments(data);
        } else {
          return;
        }
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [articleId]);

  useEffect(() => {
    const shuffled = [...EDITORIAL_ARTICLES].sort(() => 0.5 - Math.random());
    let picks = shuffled.slice(0, 4);

    if(limitRelated) {
        picks = FEATURED_RELATED;
    }

    setRelatedArticles(picks);
  }, []);

  // Submits the comment to the API
  const submitComment = async (name: string, email: string) => {
    if (!newComment.trim() || !postId) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: postId,
          content: newComment,
          author_name: name,
          author_email: email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit comment.");
      }

      const addedComment = await response.json();
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred while posting your comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles the submission of the main comment form
  const handleCommentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (authorName && authorEmail) {
      submitComment(authorName, authorEmail);
    } else {
      setShowUserDetailsForm(true);
    }
  };

  // Handles submission of the user details form
  const handleUserDetailsSubmit = (event: FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const name = nameInput.value;
    const email = emailInput.value;

    if (name && email) {
      setAuthorName(name);
      setAuthorEmail(email);

      const expiry = new Date().getTime() + 90 * 24 * 60 * 60 * 1000; // 90 days
      const userDetails: UserDetails = { name, email, expiry };
      localStorage.setItem("nora_comment_user", JSON.stringify(userDetails));

      setShowUserDetailsForm(false);
      submitComment(name, email);
    }
  };

  return (
    <Band z={3} background={COLORS.paper} paper>
      {showUserDetailsForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 11, 43, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: COLORS.paper, padding: r(isMobile ? 50 : 40), borderRadius: r(10), width: isMobile ? '90%' : r(500), boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <form onSubmit={handleUserDetailsSubmit}>
              <h3 className="font-ivy" style={{ fontSize: r(isMobile ? 50 : 30), color: COLORS.navy, marginBottom: r(20), marginTop: 0 }}>
                Just one more step...
              </h3>
              <p className="font-inter" style={{ fontSize: r(isMobile ? 32 : 16), lineHeight: r(isMobile ? 42 : 24), marginBottom: r(30) }}>
                Please provide your name and email to post a comment. This will only be asked once.
              </p>
              <div style={{ marginBottom: r(20) }}>
                <label htmlFor="name" className="label" style={{ display: 'block', marginBottom: r(10), fontSize: r(isMobile ? 28 : 14) }}>Name</label>
                <input type="text" id="name" name="name" required style={{ width: '100%', padding: r(10), fontSize: r(isMobile ? 32 : 16), border: `1px solid ${LINE_LIGHT}`, borderRadius: r(4) }} />
              </div>
              <div style={{ marginBottom: r(30) }}>
                <label htmlFor="email" className="label" style={{ display: 'block', marginBottom: r(10), fontSize: r(isMobile ? 28 : 14) }}>Email</label>
                <input type="email" id="email" name="email" required style={{ width: '100%', padding: r(10), fontSize: r(isMobile ? 32 : 16), border: `1px solid ${LINE_LIGHT}`, borderRadius: r(4) }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: r(20) }}>
                <button type="button" onClick={() => setShowUserDetailsForm(false)} style={{ background: 'transparent', border: `1px solid ${COLORS.navy}`, color: COLORS.navy, padding: `${r(10)} ${r(20)}`, cursor: 'pointer', fontSize: r(isMobile ? 30 : 14), borderRadius: r(4) }}>
                  Cancel
                </button>
                <button type="submit" style={{ background: COLORS.purple, color: 'white', border: 'none', padding: `${r(10)} ${r(20)}`, cursor: 'pointer', fontSize: r(isMobile ? 30 : 14), borderRadius: r(4) }}>
                  Save and Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPopup && (
        <div style={popupStyles}>
          <div style={popupContentStyles}>
            <button onClick={() => setShowPopup(false)} style={closeButtonStyles}>
              &times;
            </button>
            <iframe
              src={MONDAY_FORM}
              style={iframeStyles}
              frameBorder="0"
              title="Subscription Form"
            ></iframe>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "flex-start",
          gap: r(64),
          paddingTop: top(2487),
          paddingBottom: isMobile ? 0 : r(80),
        }}
      >
        {/* Left Column */}
        <div
          style={{
            flex: isMobile ? "none" : "0 0 " + r(710),
            width: isMobile ? "90%" : undefined,
            display: "flex",
            flexDirection: "column",
            gap: r(80),
            paddingLeft: isMobile ? 0 : r(60),
          }}
        >
          <div>
            <Reveal>
              <h2 className="font-ivy" style={{ fontSize: isMobile ? r(100) : r(60), lineHeight: isMobile ? r(100) : r(60), letterSpacing: r(-1.2), color: COLORS.navy, margin: 0, whiteSpace: isMobile ? "normal" : "nowrap" }}>
                Join the Conversation
              </h2>
            </Reveal>
            <RevealImg delay={0.2} style={{ position: "relative", left: isMobile ? r(340) : r(185), top: isMobile ? r(15) : r(5), width: isMobile ? r(500) : r(302), height: isMobile ? r(10) : r(6) }}>
              <img src={A("underline-join.svg")} alt="" style={{ width: "100%", height: "100%" }} />
            </RevealImg>
            <Reveal delay={0.1} style={{ position: "relative", top: r(15) }}>
              <p className="font-inter" style={{ fontSize: isMobile ? r(40) : r(16), lineHeight: isMobile ? r(50) : r(28), letterSpacing: r(0.32), color: COLORS.black }}>
                Your perspective adds to our story.
              </p>
            </Reveal>
            <div style={{ marginTop: isMobile ? r(120) : r(83), width: isMobile ? "100%" : r(648), display: "flex", flexDirection: "column", alignItems: isMobile ? "start" : "flex-end", gap: isMobile ? r(40) : r(28) }}>
              {isLoading ? (
                <p>Loading comments...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={comment.id} style={{ width: "100%" }}>
                    <Comment
                      avatar={comment.author_avatar_urls["48"]}
                      name={comment.author_name}
                      date={DateTime.fromISO(comment.date, { zone: 'utc' }).toLocal().toFormat("dd MMMM y, t")}
                      likes={comment.likes || 0}
                      body={comment.content.rendered.replace(/<p>|<\/p>/g, "")}
                      delay={index * 0.05}
                    />
                    {index < comments.length - 1 && (
                      <DrawLine style={{ width: isMobile ? "100%" : r(582), height: r(2), background: LINE_LIGHT, marginTop: isMobile ? r(40) : r(28) }} />
                    )}
                  </div>
                ))
              )}
              <Reveal delay={0.05} style={{ width: isMobile ? "100%" : r(582) }}>
                <form onSubmit={handleCommentSubmit} style={{ display: "flex", gap: r(20), alignItems: "flex-start", paddingTop: r(10) }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: r(isMobile ? 60 : 39), height: r(isMobile ? 60 : 39), borderRadius: "50%", background: COLORS.blue, flexShrink: 0 }}>
                    <img src={A("icon-send.svg")} alt="" style={{ width: r(isMobile ? 25 : 15), height: r(isMobile ? 25 : 15) }} />
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: r(12), width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share a thought...."
                        disabled={isSubmitting}
                        className="font-inter"
                        style={{
                          fontSize: isMobile ? r(30) : r(12),
                          letterSpacing: r(0.24),
                          color: COLORS.black,
                          border: "none",
                          background: "transparent",
                          outline: "none",
                          width: "100%",
                        }}
                      />
                      <button type="submit" disabled={isSubmitting} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        <span className="font-inter" style={{ fontSize: isMobile ? r(30) : r(12), letterSpacing: r(0.24), color: COLORS.black }}>
                          {isSubmitting ? "POSTING..." : "POST"}
                        </span>
                      </button>
                    </div>
                    <div style={{ width: "100%", height: r(2), background: LINE_LIGHT }} />
                  </div>
                </form>
              </Reveal>
            </div>
          </div>
          <div>
            <Reveal>
              <p className="label" style={{ fontSize: isMobile ? r(50) : r(18), color: COLORS.black }}>RELATED ARTICLES</p>
            </Reveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                gap: r(24),
                marginTop: r(16),
              }}
            >
              {relatedArticles.map((article, index) => {
                const randomImageNumber = Math.floor(Math.random() * 3) + 1;
                const fallbackImage = `related-${randomImageNumber}.jpg`;
                return (
                  <RelatedCard
                    key={article.href}
                    img={A(article.image || fallbackImage)}
                    title={article.title || ''}
                    href={article.href || '#'}
                    delay={index * 0.08}
                  />
                );
              })}
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div
          style={{
            flex: isMobile ? "none" : 1,
            width: isMobile ? "100vw" : undefined,
            background: COLORS.navy,
            padding: isMobile ? `${r(120)} 5vw` : `${r(80)} ${r(56)}`,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? r(60) : r(30),
            ...(isMobile && { ...fullBleed, boxSizing: "border-box" }),
          }}
        >
          {author && (
            <>
              <Reveal>
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? r(60) : r(30) }}>
                  {author.avatar && (
                    <RevealImg delay={0.05} style={{ width: r(isMobile ? 300 : 100), height: r(isMobile ? 300 : 100), borderRadius: '50%', overflow: 'hidden' }}>
                      <img src={author.avatar} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </RevealImg>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: r(16) }}>
                    <p className="font-arapey" style={{ fontStyle: "italic", fontSize: r(isMobile ? 80 : 40), lineHeight: r(isMobile ? 80 : 50), letterSpacing: r(-0.7), color: COLORS.white, margin: 0 }}>{author.name}</p>
                    <p className="font-inter" style={{ fontSize: r(isMobile ? 40 : 15), lineHeight: r(isMobile ? 50 : 24), letterSpacing: r(0.28), color: COLORS.white }}>
                      {author.bio}
                    </p>
                  </div>
                  {/* <a className="arrow-link" href="#" style={{ gap: r(24) }}>
                    <span className="label" style={{ color: COLORS.white, fontSize: r(isMobile ? 30 : 18) }}>More from {author.name?.split(' ')[0].toLowerCase()}</span>
                    <img className="arrow" src={A("arrow-morefrom.svg")} alt="" style={{ width: r(isMobile ? 32 : 16), height: r(isMobile ? 18 : 9) }} />
                  </a> */}
                </div>
              </Reveal>
              <DrawLine style={{ width: "100%", height: r(2), background: LINE_NAVY }} />
            </>
          )}
          <div>
            <p className="label" style={{ color: "white", fontSize: r(isMobile ? 30 : 18) }}>share article</p>
          </div>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {["social-1", "social-2", "social-3", "social-4", "social-5", "social-6"].map((s) => (
                <Social key={s} src={A(`${s}.svg`)} />
              ))}
            </div>
          </Reveal>
          <DrawLine style={{ width: "100%", height: r(2), background: LINE_NAVY }} />
          <Reveal delay={0.05}>
            <div style={{ display: "flex", flexDirection: "column", gap: r(54) }}>
              <div style={{ display: "flex", flexDirection: "column", gap: r(9) }}>
                <p className="font-ivy" style={{ fontSize: r(isMobile ? 60 : 35), lineHeight: r(isMobile ? 70 : 50), color: COLORS.white, margin: 0 }}>Industry-level consequential insights delivered to you. Subscribe.</p>
              </div>
              <button
                onClick={() => setShowPopup(true)}
                className="label"
                style={{
                  background: "transparent",
                  border: `1px solid white`,
                  color: "white",
                  padding: isMobile ? `${r(20)} ${r(40)}` : "0.75rem 1.5rem",
                  fontSize: isMobile ? r(30) : "0.8rem",
                  cursor: "pointer",
                  borderRadius: "50px",
                  transition: "background-color 0.3s, color 0.3s",
                  alignSelf: 'flex-start'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = COLORS.navy; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "white"; }}
              >
                SUBSCRIBE NOW
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </Band>
  );
}
