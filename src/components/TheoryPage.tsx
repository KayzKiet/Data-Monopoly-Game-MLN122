import { useState } from 'react';
import { getSourceReferencesByIds, sourceReferences } from '../data/sources';

interface TheoryPageProps {
  onBack: () => void;
}

type TheoryTab = 'game' | 'core';

const gameTheorySections = [
  {
    title: '1. Độc quyền trong kinh tế chính trị Mác - Lênin',
    body:
      'Trong phần chủ nghĩa tư bản độc quyền, độc quyền được trình bày gắn với sự tập trung sản xuất và tư bản ở trình độ cao, làm xuất hiện các tổ chức độc quyền có khả năng chi phối sản xuất, thị trường và giá cả để thu lợi nhuận độc quyền cao. Vì vậy, game không hiểu độc quyền đơn giản là “một công ty bán một món hàng”, mà là quyền lực thị trường được tạo ra từ quy mô, kiểm soát nguồn lực và rào cản cạnh tranh.',
    sourceIds: ['mln-textbook', 'lenin-imperialism'],
  },
  {
    title: '2. Tích tụ, tập trung tư bản và cạnh tranh',
    body:
      'Lý luận kinh tế chính trị Mác - Lênin nhấn mạnh cạnh tranh trong chủ nghĩa tư bản có thể thúc đẩy tích tụ và tập trung tư bản: doanh nghiệp mở rộng quy mô, doanh nghiệp yếu bị loại bỏ hoặc bị thâu tóm, tư bản dồn vào các chủ thể lớn hơn. Đây là cơ sở để game cho phép mua tài sản, nâng cấp, thu phí và tạo quyền lực thị trường sau nhiều vòng chơi.',
    sourceIds: ['mln-textbook'],
  },
  {
    title: '3. Độc quyền dầu mỏ trong game',
    body:
      'Các ô mỏ dầu, nhà máy lọc dầu, đường ống và logistics là ví dụ mô phỏng cách một chủ thể có thể tăng sức mạnh khi kiểm soát tài nguyên vật chất và các khâu quan trọng của chuỗi sản xuất - lưu thông. Đây là phần vận dụng vào chủ đề dầu mỏ, không phải một trích dẫn nguyên văn từ giáo trình.',
    sourceIds: ['mln-textbook', 'lenin-imperialism'],
  },
  {
    title: '4. Độc quyền dữ liệu là phần vận dụng hiện đại',
    body:
      'Các ô nền tảng số, cloud, dữ liệu, quảng cáo và AI dùng để mô phỏng quyền lực thị trường trong kinh tế số. Nguồn OECD và EU cho thấy nền tảng số có thể có lợi thế từ hiệu ứng mạng lưới, dữ liệu, quy mô và vị trí trung gian. Khi liên hệ với kinh tế chính trị Mác - Lênin, cần nói rõ đây là vận dụng phân tích độc quyền vào bối cảnh mới, không phải khái niệm cổ điển được nêu nguyên văn trong giáo trình.',
    sourceIds: ['oecd-digital-market-power', 'eu-dma'],
  },
  {
    title: '5. Hiệu ứng mạng lưới và rào cản gia nhập',
    body:
      'Hiệu ứng mạng lưới nghĩa là giá trị của một nền tảng có thể tăng khi có thêm người dùng hoặc bên tham gia. Trong game, người chơi có nhiều người dùng và dữ liệu sẽ có lợi thế, nhưng điều này không có nghĩa nền tảng lớn luôn thắng tuyệt đối; sự kiện, điều tiết và khủng hoảng được thêm vào để người học thấy thị trường còn chịu tác động của chính sách và phản ứng xã hội.',
    sourceIds: ['oecd-digital-market-power', 'eu-dma'],
  },
  {
    title: '6. Giới hạn lịch sử của chủ nghĩa tư bản hiện đại',
    body:
      'Thông điệp của game là: hình thức độc quyền có thể thay đổi từ tài nguyên vật chất sang dữ liệu và nền tảng, nhưng xu hướng tập trung tư bản, quyền lực thị trường và rào cản cạnh tranh vẫn là vấn đề cần phân tích. Đây là cách liên hệ với nội dung kinh tế chính trị Mác - Lênin về chủ nghĩa tư bản độc quyền và các mâu thuẫn của nó, đồng thời đặt trong bối cảnh kinh tế số hiện nay.',
    sourceIds: ['mln-textbook', 'lenin-imperialism', 'oecd-digital-market-power'],
  },
];

const coreTheorySections = [
  {
    title: '1. Lý luận của V.I. Lênin về chủ nghĩa tư bản độc quyền',
    body:
      'Tích tụ và tập trung tư bản làm xuất hiện các xí nghiệp lớn; các xí nghiệp lớn có thể thỏa hiệp, liên minh với nhau để tạo thành các tổ chức độc quyền. Lợi nhuận độc quyền là lợi nhuận cao hơn lợi nhuận bình quân, gắn với khả năng áp đặt giá cả độc quyền đối với hàng hóa và dịch vụ.',
    sourceIds: ['mln-textbook', 'lenin-imperialism'],
  },
  {
    title: '2. Cạnh tranh không biến mất khi độc quyền xuất hiện',
    body:
      'Độc quyền sinh ra từ cạnh tranh tự do nhưng không xóa bỏ cạnh tranh. Trái lại, cạnh tranh trở nên gay gắt và phức tạp hơn: cạnh tranh giữa các tổ chức độc quyền, trong nội bộ độc quyền và giữa độc quyền với doanh nghiệp ngoài độc quyền.',
    sourceIds: ['mln-textbook'],
  },
  {
    title: '3. Biểu hiện mới của độc quyền trong điều kiện ngày nay',
    body:
      'Trong điều kiện cách mạng khoa học và công nghệ hiện đại, độc quyền có biểu hiện mới ở các tập đoàn xuyên quốc gia, chuỗi giá trị và mạng lưới sản xuất toàn cầu. Khi vận dụng vào kinh tế số, có thể phân tích dữ liệu lớn, thuật toán, hạ tầng cloud và hệ sinh thái nền tảng như những nguồn lực then chốt tạo quyền lực thị trường.',
    sourceIds: ['mln-textbook', 'oecd-digital-market-power', 'eu-dma'],
  },
  {
    title: '4. Mâu thuẫn cơ bản của chủ nghĩa tư bản hiện đại trong độc quyền dữ liệu',
    body:
      'Mâu thuẫn cơ bản của chủ nghĩa tư bản là mâu thuẫn giữa tính xã hội hóa ngày càng cao của lực lượng sản xuất với hình thức chiếm hữu tư nhân tư bản chủ nghĩa về tư liệu sản xuất. Trong kinh tế số, dữ liệu do hoạt động xã hội rộng lớn tạo ra nhưng quyền kiểm soát và lợi ích kinh tế có thể tập trung vào một số chủ sở hữu nền tảng.',
    sourceIds: ['mln-textbook', 'oecd-digital-market-power'],
  },
  {
    title: '5. Xu hướng kìm hãm tiến bộ kỹ thuật',
    body:
      'Độc quyền có thể tạo xu hướng trì hoãn hoặc kìm hãm tiến bộ kỹ thuật nhằm duy trì giá cả độc quyền và lợi nhuận độc quyền cao. Với các nền tảng số, phần liên hệ cần bám vào vấn đề quyền lực nền tảng, vị trí người gác cổng và khả năng kiểm soát hạ tầng thông tin.',
    sourceIds: ['mln-textbook', 'eu-dma'],
  },
  {
    title: '6. Cập nhật thực tiễn và thông điệp học thuật',
    body:
      'Vụ Standard Oil năm 1911 là mốc lịch sử để đối chiếu với các vụ kiện chống độc quyền hiện đại nhắm vào Google và Big Tech. DMA, DSA và thuật ngữ gatekeeper của Liên minh Châu Âu là ví dụ pháp lý hiện đại nhằm điều tiết nền tảng lớn và các dịch vụ số. Những ví dụ này dùng để vận dụng và minh họa logic độc quyền trong kinh tế số, không phải thuật ngữ nguyên bản của giáo trình Mác - Lênin.',
    sourceIds: ['standard-oil-1911', 'doj-google-adtech', 'doj-google-search', 'eu-dma', 'eu-dsa'],
  },
];

const gameUnderstandingRows = [
  {
    topic: 'Tích tụ, tập trung tư bản',
    current: 'Đã rõ qua cơ chế mua tài sản, nâng cấp, tăng giá trị tài sản và điều kiện thắng bằng quyền lực thị trường.',
    need: 'Có thể nhấn mạnh hơn sự khác nhau giữa tích tụ tư bản và tập trung tư bản trong quiz hoặc thẻ sự kiện.',
  },
  {
    topic: 'Độc quyền dầu mỏ',
    current: 'Đã rõ qua chuỗi mỏ dầu, lọc dầu, đường ống, cảng và logistics; người chơi kiểm soát nhiều khâu sẽ mạnh hơn.',
    need: 'Có thể thêm sự kiện minh họa giá cả độc quyền: người sở hữu chuỗi dầu mỏ được tăng rent tạm thời.',
  },
  {
    topic: 'Độc quyền dữ liệu',
    current: 'Đã rõ qua người dùng, dữ liệu, hạ tầng đám mây, AI, nền tảng số, hiệu ứng mạng lưới và vòng lặp người dùng - dữ liệu.',
    need: 'Nên bổ sung rõ hơn ý dữ liệu do xã hội tạo ra nhưng bị nền tảng tư nhân chiếm hữu.',
  },
  {
    topic: 'Cạnh tranh và độc quyền',
    current: 'Đã thể hiện qua nhiều người chơi cùng tranh mua tài sản, trả phí, chịu sự kiện và bị điều tiết khi dẫn đầu.',
    need: 'Có thể thêm một thẻ hoặc ô mô phỏng cạnh tranh giữa các tổ chức độc quyền với nhau.',
  },
  {
    topic: 'Lợi nhuận độc quyền',
    current: 'Đã có tiền thuê, rent tăng theo cấp, nhưng khái niệm lợi nhuận độc quyền chưa nổi bật bằng tên gọi.',
    need: 'Nên thêm nhãn UI hoặc quiz giải thích rent cao là mô phỏng lợi nhuận độc quyền cao hơn bình quân.',
  },
  {
    topic: 'Giới hạn lịch sử và điều tiết',
    current: 'Đã rõ qua ô điều tra chống độc quyền, thuế/quy định, dữ liệu mở, tẩy chay nền tảng và khủng hoảng niềm tin.',
    need: 'Nên bổ sung phần kìm hãm tiến bộ kỹ thuật và mâu thuẫn xã hội hóa dữ liệu trong tab lý thuyết/quiz.',
  },
];

const comparisonRows = [
  {
    criterion: 'Nguồn lực chính trong mô phỏng',
    oil: 'Mỏ dầu, nhiên liệu, nhà máy lọc dầu, đường ống, vận tải',
    data: 'Người dùng, dữ liệu, hạ tầng đám mây, thuật toán, nền tảng trung gian',
  },
  {
    criterion: 'Cách tạo quyền lực thị trường',
    oil: 'Kiểm soát tài nguyên và các khâu sản xuất - lưu thông quan trọng',
    data: 'Tận dụng hiệu ứng mạng lưới, dữ liệu tích lũy, quy mô và hệ sinh thái',
  },
  {
    criterion: 'Rào cản gia nhập',
    oil: 'Vốn lớn, giấy phép, hạ tầng vật chất, quyền tiếp cận tài nguyên',
    data: 'Tệp người dùng lớn, dữ liệu tích lũy, chi phí hạ tầng số, vị trí cổng vào thị trường',
  },
  {
    criterion: 'Điểm cần nói khi thuyết trình',
    oil: 'Là ví dụ dễ hiểu về độc quyền dựa trên tài nguyên vật chất',
    data: 'Là vận dụng hiện đại, cần tránh nói như khái niệm nguyên văn trong giáo trình',
  },
  {
    criterion: 'Vai trò điều tiết',
    oil: 'Thuế, giấy phép, kiểm soát môi trường, cạnh tranh và hạ tầng',
    data: 'Luật cạnh tranh, dữ liệu mở, quyền riêng tư, quy định nền tảng lớn',
  },
];

const learningOutcomeRows = [
  {
    id: 'LO1',
    outcome: 'Giải thích được nguyên nhân hình thành độc quyền',
    evidence: 'Theo dõi quá trình mua tài sản, nâng cấp, tích lũy vốn và quyền lực thị trường qua nhiều vòng.',
  },
  {
    id: 'LO2',
    outcome: 'Phân biệt được tích tụ tư bản và tập trung tư bản',
    evidence: 'Tích tụ thể hiện qua tái đầu tư/nâng cấp; tập trung thể hiện qua tài sản và quyền lực dồn về người chơi mạnh hơn.',
  },
  {
    id: 'LO3',
    outcome: 'Nhận diện được rào cản gia nhập trong độc quyền dầu mỏ và độc quyền dữ liệu',
    evidence: 'So sánh tài sản dầu mỏ/hạ tầng với dữ liệu/nền tảng/AI, cùng chi phí phụ thuộc khi đi vào tài sản của người khác.',
  },
  {
    id: 'LO4',
    outcome: 'Phân tích được hiệu ứng mạng lưới và vòng lặp dữ liệu - AI',
    evidence: 'Quan sát cơ chế người dùng tạo dữ liệu, dữ liệu hỗ trợ AI/nền tảng, từ đó tiếp tục tạo lợi thế.',
  },
  {
    id: 'LO5',
    outcome: 'Đánh giá được tác động hai mặt của độc quyền',
    evidence: 'Đối chiếu ưu thế của người thắng với thuế, điều tiết, khủng hoảng, tẩy chay và câu hỏi phản tư xã hội.',
  },
  {
    id: 'LO6',
    outcome: 'Vận dụng lý luận Mác - Lênin để phân tích Big Tech hiện đại, đồng thời phân biệt lý luận gốc với minh họa hiện đại',
    evidence: 'Trả lời quiz, đọc giải thích và xem tổng kết sau ván về độc quyền dữ liệu/nền tảng số.',
  },
];

const gameMetricRows = [
  {
    metric: 'Vốn',
    type: 'Kinh tế',
    meaning: 'Tiền dùng để mua tài sản, nâng cấp, trả phí và chịu biến động thị trường.',
    theory: 'Tích lũy tư bản, tái đầu tư và khả năng mở rộng quy mô.',
  },
  {
    metric: 'Tài sản',
    type: 'Kinh tế',
    meaning: 'Các ô người chơi sở hữu, tạo tiền thuê và lợi thế dài hạn.',
    theory: 'Kiểm soát tư liệu sản xuất, tài nguyên, hạ tầng hoặc nền tảng.',
  },
  {
    metric: 'Người dùng',
    type: 'Kinh tế số/xã hội',
    meaning: 'Quy mô người dùng của nền tảng, tạo dữ liệu và lợi thế mạng lưới.',
    theory: 'Hiệu ứng mạng lưới và độc quyền dữ liệu.',
  },
  {
    metric: 'Dữ liệu',
    type: 'Kinh tế số',
    meaning: 'Tài nguyên chiến lược trong game, hỗ trợ nền tảng và AI.',
    theory: 'Vận dụng hiện đại về dữ liệu như nguồn lực sản xuất mới.',
  },
  {
    metric: 'Ảnh hưởng',
    type: 'Xã hội/thị trường',
    meaning: 'Sức nặng xã hội, uy tín và khả năng chi phối thị trường trong mô phỏng.',
    theory: 'Quyền lực thị trường, vị thế nền tảng và tác động xã hội.',
  },
  {
    metric: 'Điểm lý luận',
    type: 'Game hóa/học tập',
    meaning: 'Điểm nhận được khi trả lời đúng câu hỏi, phản ánh mức tiếp thu kiến thức.',
    theory: 'Không phải quyền lực thị trường trực tiếp; dùng để đo kết quả học tập.',
  },
  {
    metric: 'Quyền lực thị trường',
    type: 'Chỉ số tổng hợp mô phỏng',
    meaning: 'Tổng hợp vốn, tài sản, người dùng, dữ liệu và ảnh hưởng để ước lượng mức chi phối.',
    theory: 'Độc quyền, tập trung quyền lực thị trường và rào cản cạnh tranh.',
  },
  {
    metric: 'Điểm tổng',
    type: 'Game hóa',
    meaning: 'Dùng để xếp hạng cuối game, có tính cả điểm kinh tế và điểm học tập.',
    theory: 'Phục vụ mục tiêu trò chơi, không phải khái niệm lý luận nguyên bản.',
  },
];

export function TheoryPage({ onBack }: TheoryPageProps) {
  const [activeTab, setActiveTab] = useState<TheoryTab>('game');

  return (
    <section className="screen-shell space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">Lý thuyết</p>
          <h1 className="section-title mt-2">Từ độc quyền dầu mỏ đến độc quyền dữ liệu</h1>
          <p className="mt-3 text-base leading-7 text-slate-300">
            Trang này tách rõ khái niệm kinh tế chính trị Mác - Lênin với phần vận dụng trong game, để người học không nhầm mô phỏng gameplay với trích dẫn giáo trình.
          </p>
        </div>
        <button className="secondary-button" onClick={onBack} type="button">
          Trang chủ
        </button>
      </div>

      <div className="flex w-fit flex-wrap gap-2 rounded-lg border border-white/10 bg-oil/60 p-2">
        <TheoryTabButton active={activeTab === 'game'} label="Lý thuyết trong game" onClick={() => setActiveTab('game')} />
        <TheoryTabButton active={activeTab === 'core'} label="Cơ sở lý thuyết" onClick={() => setActiveTab('core')} />
      </div>

      {activeTab === 'game' ? <GameTheoryContent /> : <CoreTheoryContent />}

      <div className="panel">
        <h2 className="text-xl font-black text-white">Nguồn tham khảo</h2>
        <div className="mt-4 grid gap-3">
          {sourceReferences.map((source) => (
            <a
              className="rounded-lg border border-white/10 bg-oil/60 p-4 text-sm font-semibold leading-6 text-slate-200 transition hover:border-cyan hover:text-cyan"
              href={source.href}
              key={source.id}
              rel="noreferrer"
              target="_blank"
            >
              {source.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function GameTheoryContent() {
  return (
    <>
      <div className="panel overflow-x-auto">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Sau khi chơi</p>
          <h2 className="mt-2 text-2xl font-black text-white">Người học học được gì sau khi chơi</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Bảng này giúp người chơi thấy mỗi cơ chế trong game đang minh họa nội dung học tập nào.
          </p>
        </div>

        <table className="mt-5 w-full min-w-[860px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-cyan">
              <th className="rounded-tl-lg border border-white/10 bg-oil/80 px-4 py-3">Mục</th>
              <th className="border-y border-r border-white/10 bg-oil/80 px-4 py-3">Người học hiểu được</th>
              <th className="rounded-tr-lg border-y border-r border-white/10 bg-oil/80 px-4 py-3">Thấy qua đâu trong game</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {learningOutcomeRows.map((row) => (
              <tr key={row.id}>
                <td className="border-x border-b border-white/10 px-4 py-4 font-black text-gold">{row.id}</td>
                <td className="border-b border-r border-white/10 px-4 py-4 font-semibold leading-6 text-white">{row.outcome}</td>
                <td className="border-b border-r border-white/10 px-4 py-4 leading-6">{row.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {gameTheorySections.map((section) => (
          <article className="panel" key={section.title}>
            <h2 className="text-xl font-black leading-7 text-white">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{section.body}</p>
            <SourceBadges sourceIds={section.sourceIds} />
          </article>
        ))}
      </div>

      <div className="panel overflow-x-auto">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Chỉ số game</p>
          <h2 className="mt-2 text-2xl font-black text-white">Phân loại và ý nghĩa học thuật</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Các chỉ số này là công cụ mô phỏng để học lý thuyết. Chúng không phải thước đo kinh tế học chính thức, nhưng giúp người chơi hình dung quyền lực thị trường và tác động xã hội của độc quyền.
          </p>
        </div>

        <table className="mt-5 w-full min-w-[960px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-cyan">
              <th className="rounded-tl-lg border border-white/10 bg-oil/80 px-4 py-3">Chỉ số</th>
              <th className="border-y border-r border-white/10 bg-oil/80 px-4 py-3">Loại chỉ số</th>
              <th className="border-y border-r border-white/10 bg-oil/80 px-4 py-3">Ý nghĩa trong game</th>
              <th className="rounded-tr-lg border-y border-r border-white/10 bg-oil/80 px-4 py-3">Liên hệ lý thuyết</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {gameMetricRows.map((row) => (
              <tr key={row.metric}>
                <td className="border-x border-b border-white/10 px-4 py-4 font-black text-white">{row.metric}</td>
                <td className="border-b border-r border-white/10 px-4 py-4 font-semibold text-gold">{row.type}</td>
                <td className="border-b border-r border-white/10 px-4 py-4 leading-6">{row.meaning}</td>
                <td className="border-b border-r border-white/10 px-4 py-4 leading-6">{row.theory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel overflow-x-auto">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Đối chiếu gameplay</p>
            <h2 className="mt-2 text-2xl font-black text-white">Game đã giúp hiểu gì và nên bổ sung gì</h2>
          </div>
        </div>

        <table className="mt-5 w-full min-w-[860px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-cyan">
              <th className="rounded-tl-lg border border-white/10 bg-oil/80 px-4 py-3">Nội dung lý thuyết</th>
              <th className="border-y border-r border-white/10 bg-oil/80 px-4 py-3">Game đã làm rõ</th>
              <th className="rounded-tr-lg border-y border-r border-white/10 bg-oil/80 px-4 py-3">Nên bổ sung</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {gameUnderstandingRows.map((row, index) => (
              <tr key={row.topic}>
                <td className={`border-x border-b border-white/10 px-4 py-4 font-bold text-white ${index === gameUnderstandingRows.length - 1 ? 'rounded-bl-lg' : ''}`}>
                  {row.topic}
                </td>
                <td className="border-b border-r border-white/10 px-4 py-4 leading-6">{row.current}</td>
                <td className={`border-b border-r border-white/10 px-4 py-4 leading-6 ${index === gameUnderstandingRows.length - 1 ? 'rounded-br-lg' : ''}`}>
                  {row.need}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ComparisonTable />

      <div className="rounded-lg border border-cyan/30 bg-cyan/10 p-5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan">Kết luận thuyết trình</p>
        <p className="mt-3 text-lg font-semibold leading-8 text-white">
          Game đang truyền tải tốt trục tích tụ - tập trung tư bản, độc quyền tài nguyên và độc quyền dữ liệu. Để sâu hơn, nên làm nổi bật lợi nhuận độc quyền, mâu thuẫn dữ liệu xã hội hóa với chiếm hữu tư nhân, và xu hướng kìm hãm tiến bộ kỹ thuật.
        </p>
      </div>
    </>
  );
}

function CoreTheoryContent() {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {coreTheorySections.map((section) => (
          <article className="panel" key={section.title}>
            <h2 className="text-xl font-black leading-7 text-white">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{section.body}</p>
            <SourceBadges sourceIds={section.sourceIds} />
          </article>
        ))}
      </div>

      <div className="panel">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Thông điệp học thuật cốt lõi</p>
        <h2 className="mt-2 text-2xl font-black text-white">Tách lý luận gốc với phần vận dụng hiện đại</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Khi trình bày, nên nhấn mạnh phương pháp luận: độc quyền, tích tụ tư bản, tập trung tư bản và lợi nhuận độc quyền là phần lý luận gốc; Big Tech, gatekeeper, walled garden, behavioral surplus, DMA và Cambridge Analytica là phần vận dụng hiện đại để minh họa quyền lực thị trường trong kinh tế số.
        </p>
      </div>
    </>
  );
}

function ComparisonTable() {
  return (
    <div className="panel overflow-x-auto">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">So sánh</p>
          <h2 className="mt-2 text-2xl font-black text-white">Bảng so sánh phần mô phỏng trong game</h2>
        </div>
      </div>

      <table className="mt-5 w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="text-cyan">
            <th className="rounded-tl-lg border border-white/10 bg-oil/80 px-4 py-3">Tiêu chí</th>
            <th className="border-y border-r border-white/10 bg-oil/80 px-4 py-3">Dầu mỏ</th>
            <th className="rounded-tr-lg border-y border-r border-white/10 bg-oil/80 px-4 py-3">Dữ liệu</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {comparisonRows.map((row, index) => (
            <tr key={row.criterion}>
              <td className={`border-x border-b border-white/10 px-4 py-4 font-bold text-white ${index === comparisonRows.length - 1 ? 'rounded-bl-lg' : ''}`}>
                {row.criterion}
              </td>
              <td className="border-b border-r border-white/10 px-4 py-4 leading-6">{row.oil}</td>
              <td className={`border-b border-r border-white/10 px-4 py-4 leading-6 ${index === comparisonRows.length - 1 ? 'rounded-br-lg' : ''}`}>
                {row.data}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TheoryTabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-black transition ${
        active ? 'bg-cyan text-oil shadow-glow' : 'border border-white/10 bg-white/5 text-slate-200 hover:border-cyan/50 hover:text-cyan'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function SourceBadges({ sourceIds }: { sourceIds: string[] }) {
  const sources = getSourceReferencesByIds(sourceIds);

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {sources.map((source) => (
        <a
          className="rounded border border-gold/30 bg-gold/10 px-2 py-1 text-[11px] font-bold leading-5 text-gold transition hover:border-cyan hover:text-cyan"
          href={source.href}
          key={source.id}
          rel="noreferrer"
          target="_blank"
        >
          Nguồn: {source.label}
        </a>
      ))}
    </div>
  );
}
