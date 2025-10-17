// src/App.tsx
import React, { useEffect, useState } from "react";

interface ImageDetail {
  photoId: string;
  cloudfrontUrl: string;
  contentType: string;
  uploadDate: string;
  status: string;
  s3Key: string;
  createdAt: string;
}

export default function App() {
  const [images, setImages] = useState<ImageDetail[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/images`);
      if (!res.ok) throw new Error("이미지 조회 실패");

      const data = await res.json();
      const imagesArray = Array.isArray(data.items) ? data.items : [];
      const sorted = imagesArray.sort(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setImages(sorted);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert(err.message || "이미지 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    const interval = setInterval(fetchImages, 3000); // 3초마다 갱신
    return () => clearInterval(interval);
  }, []);

  if (loading && images.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <p>이미지를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 상단 고정 로고 + 글귀 */}
      <div style={styles.fixedHeader}>
        <div style={styles.fixedHeaderInner}>
          {/* 로고 */}
          <div style={styles.logoRow}>
            <img src="/assets/logo1.jpg" alt="logo1" style={styles.logo1} />
            <img src="/assets/logo2.jpg" alt="logo2" style={styles.logo2} />
          </div>

          {/* 글귀 박스 */}
          <div style={styles.quoteBox}>
            <div style={styles.quoteText}>
              이곳에서 &apos;뭉클Here&apos;로 전하신{" "}
              <span style={{ color: "#FF6121" }}>응원메세지</span>
              입니다
              <br />
              응원해주신 모든 분들께 감사드립니다
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 리스트 */}
      <div style={styles.listContainer}>
        {images.map((image) => (
          <img
            src={image.cloudfrontUrl}
            alt={image.photoId}
            style={styles.image}
          />
        ))}
      </div>
    </div>
  );
}

// 스타일
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: "2vw",
    paddingRight: "2vw",
    paddingBottom: "2vw",
    backgroundColor: "#efefef",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  fixedHeader: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    backgroundColor: "#fff",
    padding: "1rem 0",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    paddingLeft: "2vw",
    paddingRight: "2vw",
  },
  fixedHeaderInner: {
    maxWidth: "1200px", // 이미지 리스트와 동일
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "1.5rem",
  },
  logo1: {
    width: "20vw",
    maxWidth: "200px",
    height: "auto",
  },
  logo2: {
    width: "15vw",
    maxWidth: "150px",
    height: "auto",
  },
  quoteBox: {
    backgroundColor: "#fcf8f2",
    padding: "0.8rem 1rem",
    borderRadius: 6,
    textAlign: "center",
    width: "calc(100% - 2vw)",
    boxSizing: "border-box",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.15)",
    alignSelf: "center",
  },
  quoteText: {
    fontSize: "1rem",
    color: "#222",
    lineHeight: 1.5,
  },
  uploadDateBox: {
    fontWeight: "bold",
    color: "#222",
    fontSize: "1rem",
    backgroundColor: "#f5f5f5",
    padding: "0.5rem 1rem",
    borderRadius: 6,
    textAlign: "center",
    width: "calc(50% - 1vw)", // 2열 그리드 1컬럼 폭과 동일
    boxSizing: "border-box",
    alignSelf: "center",
  },
  listContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", // 2열 고정
    gap: "2vw",
    marginTop: "1rem",
    maxWidth: "1200px",
    width: "100%",
  },

  imageCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "1vw",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
  },
};
