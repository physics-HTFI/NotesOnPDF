/**
 * @example
 * [
 *   [ dir1,
 *     [
 *       [ dir1/dir2,
 *         [
 *           dir1/dir2/file1,
 *           dir1/dir2/file2,
 *         ],
 *       ],
 *       dir1/file1,
 *       dir1/file2,
 *     ],
 *   ],
 *   file1,
 *   file2,
 * ]
 */
export type FileTree = (string | [string, FileTree])[];
