interface TheoryPageProps {
  onBack: () => void;
}

const theorySections = [
  {
    title: '1. Độc quyền là gì?',
    body: 'Độc quyền là trạng thái một hoặc một nhóm rất nhỏ doanh nghiệp nắm quyền chi phối thị trường. Khi quyền lực tập trung, doanh nghiệp có thể tác động tới giá cả, nguồn cung, điều kiện cạnh tranh và khả năng gia nhập thị trường của đối thủ mới.',
  },
  {
    title: '2. Độc quyền dầu mỏ: kiểm soát tài nguyên vật chất',
    body: 'Trong thời đại dầu mỏ, quyền lực độc quyền thường đến từ việc kiểm soát mỏ dầu, nhà máy lọc dầu, đường ống, cảng biển và mạng lưới vận chuyển. Ai nắm tài nguyên khan hiếm và hạ tầng vật chất thì có lợi thế lớn trong sản xuất và phân phối.',
  },
  {
    title: '3. Độc quyền dữ liệu: kiểm soát người dùng, dữ liệu, thuật toán và nền tảng',
    body: 'Trong kinh tế số, quyền lực không chỉ nằm ở tài nguyên vật chất mà còn nằm ở nền tảng số. Doanh nghiệp càng có nhiều người dùng thì càng thu thập nhiều dữ liệu, cải thiện thuật toán, phát triển AI và củng cố vị thế thị trường.',
  },
  {
    title: '4. So sánh độc quyền tài nguyên và độc quyền dữ liệu',
    body: 'Độc quyền dầu mỏ và độc quyền dữ liệu khác nhau về hình thức, nhưng giống nhau ở bản chất: đều tạo ra quyền lực thị trường thông qua kiểm soát nguồn lực then chốt và tạo rào cản cho đối thủ.',
  },
  {
    title: '5. Hiệu ứng mạng lưới',
    body: 'Hiệu ứng mạng lưới xảy ra khi một nền tảng càng đông người dùng thì càng có giá trị với người dùng mới. Điều này khiến nền tảng lớn tiếp tục lớn hơn, còn nền tảng nhỏ khó thu hút người dùng dù có sản phẩm tương tự.',
  },
  {
    title: '6. Dữ liệu như một loại tài nguyên chiến lược mới',
    body: 'Dữ liệu giúp doanh nghiệp hiểu hành vi người dùng, dự đoán nhu cầu, tối ưu quảng cáo, huấn luyện AI và tự động hóa quyết định. Vì vậy, dữ liệu trở thành một nguồn lực chiến lược giống như dầu mỏ từng là nguồn lực chiến lược của công nghiệp hiện đại.',
  },
  {
    title: '7. Giới hạn lịch sử của CNTB hiện đại',
    body: 'CNTB hiện đại thúc đẩy cạnh tranh và đổi mới, nhưng cạnh tranh cũng có xu hướng dẫn tới tích tụ tư bản, tập trung tư bản và độc quyền. Khi quyền lực thị trường tập trung, bất bình đẳng quyền lực và rào cản gia nhập trở thành giới hạn nội tại của hệ thống.',
  },
  {
    title: '8. Game này mô phỏng lý luận như thế nào?',
    body: 'Người chơi mua tài sản dầu mỏ hoặc dữ liệu, trả phí khi phụ thuộc vào tài sản của người khác, gặp sự kiện chính sách và trả lời quiz lý luận. Cơ chế điểm market power cho thấy tiền, tài sản, người dùng, dữ liệu và điểm lý luận cùng phản ánh quá trình tập trung quyền lực thị trường.',
  },
];

const comparisonRows = [
  {
    criterion: 'Tài nguyên chính',
    oil: 'Dầu mỏ, mỏ khai thác, nhiên liệu khan hiếm',
    data: 'Người dùng, dữ liệu hành vi, dữ liệu giao dịch',
  },
  {
    criterion: 'Hạ tầng kiểm soát',
    oil: 'Nhà máy lọc dầu, đường ống, cảng, logistics',
    data: 'Nền tảng số, cloud, thuật toán, hệ sinh thái ứng dụng',
  },
  {
    criterion: 'Cách tạo lợi nhuận',
    oil: 'Bán tài nguyên, kiểm soát nguồn cung, thu phí vận chuyển',
    data: 'Quảng cáo, phí nền tảng, phân tích dữ liệu, dịch vụ AI',
  },
  {
    criterion: 'Rào cản gia nhập',
    oil: 'Vốn lớn, giấy phép, hạ tầng vật chất, quyền tiếp cận mỏ',
    data: 'Hiệu ứng mạng lưới, dữ liệu tích lũy, thuật toán, chi phí cloud',
  },
  {
    criterion: 'Vai trò công nghệ',
    oil: 'Tăng năng suất khai thác, lọc dầu và vận chuyển',
    data: 'Tối ưu đề xuất, quảng cáo, dự đoán, AI và tự động hóa',
  },
  {
    criterion: 'Tác động xã hội',
    oil: 'Phụ thuộc năng lượng, bất bình đẳng tiếp cận tài nguyên, ô nhiễm',
    data: 'Phụ thuộc nền tảng, riêng tư dữ liệu, quyền lực thuật toán',
  },
];

export function TheoryPage({ onBack }: TheoryPageProps) {
  return (
    <section className="screen-shell space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">MLN122 Theory</p>
          <h1 className="section-title mt-2">Từ độc quyền dầu mỏ đến độc quyền dữ liệu</h1>
          <p className="mt-3 text-base leading-7 text-slate-300">
            Trang này tóm tắt phần lý luận để dùng khi thuyết trình: rõ ý, ngắn gọn và liên hệ trực tiếp với cơ chế game.
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
          </article>
        ))}
      </div>

      <div className="panel overflow-x-auto">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Comparison</p>
            <h2 className="mt-2 text-2xl font-black text-white">Bảng so sánh độc quyền dầu mỏ và độc quyền dữ liệu</h2>
          </div>
        </div>

        <table className="mt-5 w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-cyan">
              <th className="rounded-tl-lg border border-white/10 bg-oil/80 px-4 py-3">Tiêu chí</th>
              <th className="border-y border-r border-white/10 bg-oil/80 px-4 py-3">Độc quyền dầu mỏ</th>
              <th className="rounded-tr-lg border-y border-r border-white/10 bg-oil/80 px-4 py-3">Độc quyền dữ liệu</th>
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
          Hình thức độc quyền chuyển từ tài nguyên vật chất sang dữ liệu và nền tảng, nhưng bản chất tập trung tư bản
          và quyền lực thị trường vẫn tồn tại. Đây là điểm then chốt để liên hệ với giới hạn lịch sử của CNTB hiện đại.
        </p>
      </div>
    </section>
  );
}
