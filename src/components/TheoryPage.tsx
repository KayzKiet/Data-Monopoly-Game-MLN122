import { getSourceReferencesByIds, sourceReferences } from '../data/sources';

interface TheoryPageProps {
  onBack: () => void;
}

const theorySections = [
  {
    title: '1. Độc quyền trong kinh tế chính trị Mác - Lênin',
    body:
      'Trong phần chủ nghĩa tư bản độc quyền, độc quyền được trình bày gắn với sự tập trung sản xuất và tư bản ở trình độ cao, làm xuất hiện các tổ chức độc quyền có khả năng chi phối sản xuất, thị trường và giá cả để thu lợi nhuận độc quyền cao. Vì vậy, game không hiểu độc quyền đơn giản là “một công ty bán một món hàng”, mà là quyền lực thị trường được tạo ra từ quy mô, kiểm soát nguồn lực và rào cản cạnh tranh.',
    sourceIds: ['mln-textbook', 'lenin-imperialism'],
  },
  {
    title: '2. Tích tụ, tập trung tư bản và cạnh tranh',
    body:
      'Lý luận MLN nhấn mạnh cạnh tranh trong chủ nghĩa tư bản có thể thúc đẩy tích tụ và tập trung tư bản: doanh nghiệp mở rộng quy mô, doanh nghiệp yếu bị loại bỏ hoặc bị thâu tóm, tư bản dồn vào các chủ thể lớn hơn. Đây là cơ sở để game cho phép mua tài sản, nâng cấp, thu phí và tạo quyền lực thị trường sau nhiều vòng chơi.',
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
      'Các ô nền tảng số, cloud, dữ liệu, quảng cáo và AI dùng để mô phỏng quyền lực thị trường trong kinh tế số. Nguồn OECD và EU cho thấy nền tảng số có thể có lợi thế từ hiệu ứng mạng lưới, dữ liệu, quy mô và vị trí trung gian. Khi liên hệ với MLN, cần nói rõ đây là vận dụng phân tích độc quyền vào bối cảnh mới, không phải khái niệm cổ điển được nêu nguyên văn trong giáo trình.',
    sourceIds: ['oecd-digital-market-power', 'eu-dma'],
  },
  {
    title: '5. Hiệu ứng mạng lưới và rào cản gia nhập',
    body:
      'Hiệu ứng mạng lưới nghĩa là giá trị của một nền tảng có thể tăng khi có thêm người dùng hoặc bên tham gia. Trong game, người chơi có nhiều users và data sẽ có lợi thế, nhưng điều này không có nghĩa nền tảng lớn luôn thắng tuyệt đối; sự kiện, điều tiết và khủng hoảng được thêm vào để người học thấy thị trường còn chịu tác động của chính sách và phản ứng xã hội.',
    sourceIds: ['oecd-digital-market-power', 'eu-dma'],
  },
  {
    title: '6. Giới hạn lịch sử của CNTB hiện đại',
    body:
      'Thông điệp của game là: hình thức độc quyền có thể thay đổi từ tài nguyên vật chất sang dữ liệu và nền tảng, nhưng xu hướng tập trung tư bản, quyền lực thị trường và rào cản cạnh tranh vẫn là vấn đề cần phân tích. Đây là cách liên hệ với nội dung MLN về chủ nghĩa tư bản độc quyền và các mâu thuẫn của nó, đồng thời đặt trong bối cảnh kinh tế số hiện nay.',
    sourceIds: ['mln-textbook', 'lenin-imperialism', 'oecd-digital-market-power'],
  },
];

const comparisonRows = [
  {
    criterion: 'Nguồn lực chính trong mô phỏng',
    oil: 'Mỏ dầu, nhiên liệu, nhà máy lọc dầu, đường ống, vận tải',
    data: 'Người dùng, dữ liệu, cloud, thuật toán, nền tảng trung gian',
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
    data: 'Là vận dụng hiện đại, cần tránh nói như khái niệm nguyên văn trong giáo trình MLN',
  },
  {
    criterion: 'Vai trò điều tiết',
    oil: 'Thuế, giấy phép, kiểm soát môi trường, cạnh tranh và hạ tầng',
    data: 'Luật cạnh tranh, dữ liệu mở, quyền riêng tư, quy định nền tảng lớn',
  },
];

export function TheoryPage({ onBack }: TheoryPageProps) {
  return (
    <section className="screen-shell space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">Lý thuyết MLN122</p>
          <h1 className="section-title mt-2">Từ độc quyền dầu mỏ đến độc quyền dữ liệu</h1>
          <p className="mt-3 text-base leading-7 text-slate-300">
            Trang này tách rõ khái niệm kinh tế chính trị Mác - Lênin với phần vận dụng trong game, để người học không nhầm mô phỏng gameplay với trích dẫn giáo trình.
          </p>
        </div>
        <button className="secondary-button" onClick={onBack} type="button">
          Trang chủ
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {theorySections.map((section) => (
          <article className="panel" key={section.title}>
            <h2 className="text-xl font-black leading-7 text-white">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{section.body}</p>
            <SourceBadges sourceIds={section.sourceIds} />
          </article>
        ))}
      </div>

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

      <div className="rounded-lg border border-cyan/30 bg-cyan/10 p-5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan">Kết luận thuyết trình</p>
        <p className="mt-3 text-lg font-semibold leading-8 text-white">
          Game dùng dầu mỏ và dữ liệu như hai bối cảnh so sánh. Phần lý luận cốt lõi là xu hướng tích tụ, tập trung tư bản và hình thành quyền lực độc quyền; phần dữ liệu là vận dụng hiện đại để người học thấy chủ đề vẫn có ý nghĩa trong kinh tế số.
        </p>
      </div>

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
